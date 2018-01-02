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

    createListElement(recordType: RecordType, fields: Field[], obj: any): ListElement<Type> {
        let titleField = fields.find((f) => f.isTitle);
        return {
            entity: obj as Type,
            firstLine: titleField && obj[titleField.name] ? obj[titleField.name] : obj._id
        }
    }

    async showCustomObjectDetailsCard(recordType: RecordType, fields: Field[], id?: string) {
        let self = this;
        let subUrl = recordType.name + "/" + (id ? id : "");
        self.customObjectDetailsCard = new Card(self.webApp, "", subUrl);
        self.customObjectDetailsCard.HtmlElement.classList.add("detailscard");
        let titleField = fields.find((f) => f.isTitle);
        let title: string;
        let propertyElements: PropertyElement[];

        let detailsSectionConfig: DetailsSectionConfig = { };
        if (id) {
            // EDIT
            let originalObject: any;
            detailsSectionConfig.onSave = async () => {
                let updatedObject = { _id: originalObject._id } as any;
                propertyElements.forEach((element) => {
                    let field = element.dataObject as Field;
                    updatedObject[field.name] = element.value;
                });
                await new GenericApi(recordType.name).save(updatedObject);
                self.webApp.toast.show("Änderungen gespeichert.");
                if (titleField && updatedObject[titleField.name] !== originalObject[titleField.name]) {
                    title = updatedObject[titleField.name];
                    self.customObjectDetailsCard.Title.HtmlElement.innerHTML = title;
                    let listElement = self.customObjectsListCardListSection.listElements.find((el) => { return el.entity._id === id; });
                    if (listElement) {
                        self.customObjectsListCardListSection.remove(listElement);
                        listElement.firstLine = title;
                        self.customObjectsListCardListSection.add(listElement);
                        self.customObjectsListCardListSection.select(id);
                    }
                }
                originalObject = updatedObject;
            };
            detailsSectionConfig.onDelete = async () => {
                if (confirm('Soll "' + title + '" wirklich gelöscht werden?')) {
                    await new GenericApi(recordType.name).delete(id);
                    self.customObjectDetailsCard.close();
                    self.webApp.toast.show('"' + title + '" wurde gelöscht.');
                    let listElement = self.customObjectsListCardListSection.listElements.find((el) => { return el.entity._id === id; });
                    if (listElement) self.customObjectsListCardListSection.remove(listElement);
                    self.webApp.setSubUrl(recordType.name + "/");
                }
            };
            detailsSectionConfig.loadProperties = async () => {
                originalObject = await new GenericApi(recordType.name).getOne(id);
                title = titleField && originalObject[titleField.name] ? originalObject[titleField.name] : originalObject._id;
                self.customObjectDetailsCard.Title.HtmlElement.innerHTML = title;
                propertyElements = fields.map((f) => {
                    return {
                        label: f.label,
                        type: f.type,
                        value: (originalObject as any)[f.name],
                        dataObject: f
                    } as PropertyElement
                });
                return propertyElements;
            };
        } else {
            // CREATE
            let propertyElements = fields.map((f) => {
                return {
                    label: f.label,
                    type: f.type,
                    dataObject: f
                } as PropertyElement
            });
            detailsSectionConfig.onCreate = async () => {
                let obj = {} as any;
                propertyElements.forEach((element) => {
                    let field = element.dataObject as Field;
                    obj[field.name] = element.value;
                });
                let createdObject = await new GenericApi(recordType.name).save(obj);
                let title = titleField ? createdObject[titleField.name] : "";
                self.webApp.toast.show("Das Objekt '" + title + "' wurde erstellt.");
                await self.customObjectsListCardListSection.add(self.createListElement(recordType, fields, createdObject));
                self.customObjectDetailsCard.close();
                await self.showCustomObjectDetailsCard(recordType, fields, createdObject._id);
                self.customObjectsListCardListSection.select(createdObject._id);
            };
            detailsSectionConfig.loadProperties = async () => {
                self.customObjectDetailsCard.Title.HtmlElement.innerHTML = "Neues DINGSBUMS"; // TODO: Update label depending on record type name (pluralName, sex, etc.)
                return propertyElements;
            };
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