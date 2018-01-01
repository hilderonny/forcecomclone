import { Controller } from "./controller";
import { WebApp } from "../webapp";
import { MenuItem } from "../elements/mainmenu";
import { RecordType } from "../../common/types/recordtype";
import { Card } from "../elements/card";
import { ListSection, ListElement, DetailsSectionConfig, DetailsSection, PropertyElement } from "../elements/section";
import { Type } from "../../server/core/type";
import { Api, GenericApi } from "../api";
import { Field } from "../../common/types/field";

export class CustomObjectController extends Controller {
    
    webApp: WebApp;
    customObjectsListCard: Card;
    customObjectDetailsCard: Card;
    customObjectsListCardListSection: ListSection<any>;
    // fieldDetailsCard: Card;
    // fieldsListSection: ListSection<Field>;

    createListElement(recordType: RecordType, fields: Field[], obj: object): ListElement<Type> {
        let titleField = fields.find((f) => f.isTitle);
        return {
            entity: obj as Type,
            firstLine: titleField ? (obj as any)[titleField.name] : ""
        }
    }

    async showCustomObjectDetailsCard(recordType: RecordType, fields: Field[], id?: string) {
        let self = this;
        let subUrl = recordType.name + "/" + (id ? id : "");
        self.customObjectDetailsCard = new Card(self.webApp, "", subUrl);
        self.customObjectDetailsCard.HtmlElement.classList.add("detailscard");

        let detailsSectionConfig: DetailsSectionConfig = { };
        if (id) {
        //     // EDIT
        //     // Detailssection
        //     let labelPropertyElement: PropertyElement = { label: "Bezeichnung", type: FieldType.Text, value: "" };
        //     let showInMenuPropertyElement: PropertyElement = { label: "In Menü zeigen", type: FieldType.CheckBox, value: false };
            let originalObject: object;
        //     detailsSectionConfig.sectionTitle = "Details";
        //     detailsSectionConfig.onSave = async () => {
        //         let updatedRecordType = {
        //             _id: id,
        //             label: labelPropertyElement.value,
        //             showInMenu: showInMenuPropertyElement.value
        //         } as RecordType;
        //         await self.webApp.api(RecordType).save(updatedRecordType);
        //         self.webApp.toast.show("Änderungen gespeichert.");
        //         if (updatedRecordType.label !== originalRecordType.label) {
        //             let listElement = self.recordTypesListCardListSection.listElements.find((el) => { return el.entity._id === id; });
        //             if (listElement) {
        //                 self.recordTypesListCardListSection.remove(listElement);
        //                 listElement.firstLine = updatedRecordType.label;
        //                 self.recordTypesListCardListSection.add(listElement);
        //                 self.recordTypesListCardListSection.select(id);
        //             }
        //         }
        //         if (updatedRecordType.label !== originalRecordType.label || updatedRecordType.showInMenu !== originalRecordType.showInMenu) {
        //             await self.webApp.mainMenu.load();
        //             self.recordTypeMenuItem.select!();
        //         }
        //         originalRecordType = updatedRecordType;
        //     };
        //     detailsSectionConfig.onDelete = async () => {
        //         if (confirm('Soll der RecordType wirklich gelöscht werden?')) {
        //             await self.webApp.api(RecordType).delete(id);
        //             self.recordTypeDetailsCard.close();
        //             self.webApp.toast.show("Der RecordType wurde gelöscht.");
        //             let listElement = self.recordTypesListCardListSection.listElements.find((el) => { return el.entity._id === id; });
        //             if (listElement) self.recordTypesListCardListSection.remove(listElement);
        //             if (originalRecordType.showInMenu) {
        //                 await self.webApp.mainMenu.load();
        //                 self.recordTypeMenuItem.select!();
        //             }
        //             self.webApp.setSubUrl("RecordType/");
        //         }
        //     };
            detailsSectionConfig.loadProperties = async () => {
                originalObject = await new GenericApi(recordType.name).getOne(id);
                // self.customObjectDetailsCard.Title.HtmlElement.innerHTML = (originalRecordType.label ? originalRecordType.label : originalRecordType.name);
                let propertyElements = fields.map((f) => {
                    return {
                        label: f.label,
                        type: f.type,
                        value: (originalObject as any)[f.name]
                    } as PropertyElement
                });
                    // let namePropertyElement: PropertyElement = { label: "Name", type: FieldType.Label, value: originalRecordType.name };
                // labelPropertyElement.value = originalRecordType.label;
                // showInMenuPropertyElement.value = originalRecordType.showInMenu;
                return propertyElements;
            };
        } else {
        //     // CREATE
        //     let namePropertyElement: PropertyElement = { label: "Name", type: FieldType.Text, value: "" };
        //     let labelPropertyElement: PropertyElement = { label: "Bezeichnung", type: FieldType.Text, value: "" };
        //     let showInMenuPropertyElement: PropertyElement = { label: "In Menü zeigen", type: FieldType.CheckBox, value: false };
        //     detailsSectionConfig.onCreate = async () => {
        //         let recordType = {
        //             name: namePropertyElement.value,
        //             label: labelPropertyElement.value,
        //             showInMenu: showInMenuPropertyElement.value
        //         } as RecordType;
        //         let promise = self.webApp.api(RecordType).save(recordType);
        //         promise.then(async (createdRecordType) => {
        //             self.webApp.toast.show("Der RecordType '" + namePropertyElement.value + "' wurde erstellt.");
        //             await self.recordTypesListCardListSection.add(self.createRecordTypeListElement(createdRecordType));
        //             self.recordTypeDetailsCard.close();
        //             await self.showRecordTypeDetailsCard(createdRecordType._id);
        //             self.recordTypesListCardListSection.select(createdRecordType._id);
        //             if (createdRecordType.showInMenu) {
        //                 await self.webApp.mainMenu.load();
        //                 self.recordTypeMenuItem.select!();
        //             }
        //         }, (statusCode: number) => {
        //             if (statusCode === 409) {
        //                 namePropertyElement.property!.setErrorMessage("Dieser Name ist bereits vergeben und kann nicht verwendet werden.");
        //             }
        //         });
        //     };
            let propertyElements = fields.map((f) => {
                return {
                    label: f.label,
                    type: f.type
                } as PropertyElement
            });
            detailsSectionConfig.loadProperties = async () => {
                return propertyElements;
            };
        //     detailsSectionConfig.validate = async () => {
        //         let name = namePropertyElement.value as string;
        //         if (!name || 
        //             name.length < 1 ||
        //             name.includes('__') ||
        //             name.match(/[\W]/) ||
        //             !name.match(/^[A-Za-z]/) ||
        //             [ "RecordType", "Field" ].includes(name)
        //         ) {
        //             namePropertyElement.property!.setErrorMessage("Name muss mit Buchstaben beginnen, darf nur Buchstaben (ohne Umlaute), Ziffern und '_' enthalten, darf nicht '__' enthalten und darf weder 'RecordType' noch 'Field' lauten.");
        //             return false;
        //         }
        //         return true;
        //     };
        }
        let detailsSection = new DetailsSection(detailsSectionConfig);
        self.customObjectDetailsCard.addSection(detailsSection);
        await detailsSection.load();

        self.customObjectDetailsCard.onClose = () => {
            self.customObjectsListCardListSection.select();
            self.webApp.setSubUrl(recordType.name + "/");
        };

        self.webApp.cardStack.addCard(self.customObjectDetailsCard);
    }

    async showListCard(menuItem: MenuItem, subUrl?: string) {
        let self = this;
        let recordType = menuItem.dataObject as RecordType;
        let fields = await new Api(Field).getAll('/forRecordType/' + recordType._id);
        self.customObjectsListCard = new Card(self.webApp, recordType.label, recordType.name + "/");
        self.customObjectsListCard.HtmlElement.classList.add("listcard");

        self.customObjectsListCard.onClose = () => {
            menuItem.listElement!.button!.HtmlElement.classList.remove("selected");
            self.webApp.setSubUrl("");
        }

        self.customObjectsListCardListSection = new ListSection({

            onAdd: async () => {
                self.webApp.cardStack.closeCardsRightTo(self.customObjectsListCard);
                self.showCustomObjectDetailsCard(recordType, fields);
            },

            onSelect: async (listElement) => {
                self.webApp.cardStack.closeCardsRightTo(self.customObjectsListCard);
                self.showCustomObjectDetailsCard(recordType, fields, listElement.entity._id);
            },

            loadListElements: async () => {
                let objects = await new GenericApi(recordType.name).getAll();
                return objects.map((o) => { return self.createListElement(recordType, fields, o); });
            }

        });
        self.customObjectsListCard.addSection(self.customObjectsListCardListSection);
        await self.customObjectsListCardListSection.load();

        self.webApp.cardStack.setSingleCard(self.customObjectsListCard);

        if (subUrl && subUrl.length > recordType.name.length + 1) {
            let id = subUrl.substring(recordType.name.length + 1);
            self.customObjectsListCardListSection.select(id);
            self.showCustomObjectDetailsCard(recordType, fields, id);
        }
    }
    
    async initialize(webApp: WebApp): Promise<void> {
        let self = this;
        self.webApp = webApp;
        webApp.mainMenu.menuHandlers.push({
            async load() {
                let menuItems: MenuItem[] = [];
    
                let recordTypes = await webApp.api(RecordType).getAll();
                recordTypes.forEach((rt) => {
                    if (!rt.showInMenu) return;
                    menuItems.push({
                        label: rt.label,
                        section: "",
                        dataObject: rt,
                        onClick: async (menuItem) => {
                            self.showListCard(menuItem);
                        },
                        subUrl: rt.name + "/"
                    });
                    self.webApp.addSubUrlHandler({
                        UrlPart: rt.name + "/",
                        Handler: async (completeSubUrl) => {
                            let menuItem = menuItems.find((mi) => mi.dataObject === rt) as MenuItem;
                            await self.showListCard(menuItem, completeSubUrl);
                        }
                    });
                });
    
                return menuItems;
            }
    
        });
    }

}