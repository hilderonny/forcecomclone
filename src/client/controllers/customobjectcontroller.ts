import { Controller } from "./controller";
import { WebApp } from "../webapp";
import { MenuItem } from "../elements/mainmenu";
import { RecordType } from "../../common/types/recordtype";
import { Card } from "../elements/card";
import { ListSection, ListElement, DetailsSectionConfig, DetailsSection, PropertyElement } from "../elements/section";
import { Type } from "../../server/core/type";
import { Api, GenericApi } from "../api";
import { Field } from "../../common/types/field";
import { Dialog } from "../elements/dialogs";
import { Button, AccentButton, ActionButton } from "../elements/button";
import { List } from "../elements/list";

export class CustomObjectController extends Controller {
    
    webApp: WebApp;
    customObjectsListCard: Card;
    customObjectDetailsCard: Card;
    customObjectsListCardListSection: ListSection<any>;
    childrenListSection: ListSection<any>;

    createListElement(recordType: RecordType, fields: Field[], obj: any): ListElement<Type> {
        let titleField = fields.find((f) => f.isTitle);
        return {
            entity: obj as Type,
            firstLine: titleField && obj[titleField.name] ? obj[titleField.name] : obj._id
        }
    }

    async showRecordTypeSelectionDialog(parentRecordType: RecordType, onSelect: (recordType: RecordType) => void) {

        let dialog: Dialog;
        let selectedRecordType: RecordType;

        let okButton = new AccentButton("OK");
        okButton.HtmlElement.style.display = "none";
        okButton.HtmlElement.addEventListener("click", () => {
            onSelect(selectedRecordType);
            dialog.close();
        });

        let cancelButton = new ActionButton("Abbrechen");
        cancelButton.HtmlElement.addEventListener("click", () => {
            dialog.close();
        });

        let selectRecordType = (rt: RecordType) => {
            okButton.HtmlElement.style.display = "unset";
            selectedRecordType = rt;
        };

        let list = new List();
        let recordTypes = await new GenericApi("RecordType/children/").getAll(parentRecordType._id) as RecordType[];
        recordTypes.forEach((rt) => {
            let button = new Button(rt.label, undefined, rt.name);
            button.HtmlElement.addEventListener("click", () => {
                list.select(button);
                selectRecordType(rt);
            });
            list.add(button);
        });

        dialog = new Dialog("Objekttyp auswählen", list.HtmlElement, [ okButton, cancelButton ]);
        document.body.appendChild(dialog.HtmlElement);

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
            detailsSectionConfig.sectionTitle = "Details";
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

        // Child list section
        if (id && recordType.allowedChildRecordTypeIds && recordType.allowedChildRecordTypeIds.length > 0) {
            self.childrenListSection = new ListSection<any>({
                sectionTitle: "Kindelemente",
                onAdd: async () => {
                    self.webApp.cardStack.closeCardsRightTo(self.customObjectDetailsCard);
                    self.showRecordTypeSelectionDialog(recordType, async (selectedRecordType) => {
                        self.showChildCustomObjectDetailsCard(selectedRecordType, id);
                    });
                },
                onSelect: async (listElement) => {
                    self.webApp.cardStack.closeCardsRightTo(self.customObjectDetailsCard);
                    //self.showFieldDetailsCard(id, listElement.entity._id);
                },
                loadListElements: async () => {



                    // TODO: Hier brauchen wir eine Server-API, die eine Liste von Objekten verschiedener
                    // RecordTypes samt deren Felddefinitionen liefern kann.
                    // Oder eine API, die nur ViewModels (ListElements) zurück gibt (ist das sauber so?)



                    // let children = await new GenericApi(recordType.name).getAll();
                    // return objects.map((o) => { return self.createListElement(recordType, fields, o); });
                    //     //let fields = await new Api(Field).getAll('/forRecordType/' + recordType._id);
                    // // self.childrenListSection.add(self.createListElement(recordType, fields, createdObject));

                    // let fields = await this.webApp.api(Field).getAll('/forRecordType/' + id);
                    // return fields.map((field) => { return self.createListElement(recordType, fields); });
                    return [];
                }
            });
            self.customObjectDetailsCard.addSection(self.childrenListSection);
            await self.childrenListSection.load();
        }
        

        self.customObjectDetailsCard.onClose = () => {
            self.customObjectsListCardListSection.select();
            self.webApp.setSubUrl(recordType.name + "/");
        };

        self.webApp.cardStack.addCard(self.customObjectDetailsCard);
    }

    async showChildCustomObjectDetailsCard(recordType: RecordType, parentId: string) {
        // TODO: Irgendwie Child zu Parent zuordnen, dabei Referenz auf RecordType halten, etwa so:
        // parent: { recordTypeId: ..., parentId: ... }
        // Außerdem noch Testfälle für diesen Murks erstellen
        let self = this;
        let childDetailsCard = new Card(self.webApp, "");
        childDetailsCard.HtmlElement.classList.add("detailscard");
        let fields = await new Api(Field).getAll('/forRecordType/' + recordType._id);
        let titleField = fields.find((f) => f.isTitle);
        let title: string;

        let detailsSectionConfig: DetailsSectionConfig = { };
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
            self.childrenListSection.add(self.createListElement(recordType, fields, createdObject));
            childDetailsCard.close();
        };
        detailsSectionConfig.loadProperties = async () => {
            self.customObjectDetailsCard.Title.HtmlElement.innerHTML = "Neues DINGSBUMS"; // TODO: Update label depending on record type name (pluralName, sex, etc.)
            return propertyElements;
        };

        let detailsSection = new DetailsSection(detailsSectionConfig);
        childDetailsCard.addSection(detailsSection);
        await detailsSection.load();

        self.webApp.cardStack.addCard(childDetailsCard);
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