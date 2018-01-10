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

    createListElement(fields: Field[], obj: any): ListElement<Type> {
        let titleField = fields.find((f) => f.isTitle);
        console.log(titleField, obj);
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
        let recordTypes = await new GenericApi("RecordType/children/").getAll(parentRecordType._id as string) as RecordType[];
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

    async showCustomObjectDetailsCard(recordType: RecordType, fieldMap: { [key: string]: Field[] }, id?: string) {
        let self = this;
        let subUrl = recordType.name + "/" + (id ? id : "");
        self.customObjectDetailsCard = new Card(self.webApp, "", subUrl);
        self.customObjectDetailsCard.HtmlElement.classList.add("detailscard");
        let fieldsOfRecordType = fieldMap[recordType._id as string];
        let titleField = fieldsOfRecordType.find((f) => f.isTitle);
        let title: string;
        let propertyElements: PropertyElement[];

        let detailsSectionConfig: DetailsSectionConfig = { };
        let originalObject: any;
        if (id) {
            // EDIT
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
                propertyElements = fieldsOfRecordType.map((f) => {
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
            let propertyElements = fieldsOfRecordType.map((f) => {
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
                await self.customObjectsListCardListSection.add(self.createListElement(fieldsOfRecordType, createdObject));
                self.customObjectDetailsCard.close();
                await self.showCustomObjectDetailsCard(recordType, fieldMap, createdObject._id);
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
                        self.showChildCustomObjectDetailsCard(selectedRecordType, recordType, id, fieldMap);
                    });
                },
                onSelect: async (listElement) => {
                    self.webApp.cardStack.closeCardsRightTo(self.customObjectDetailsCard);
                    //self.showFieldDetailsCard(id, listElement.entity._id);
                },
                loadListElements: async () => {
                    let listElements : ListElement<any>[] = [];
                    if (originalObject.children) {
                        (originalObject.children as any[]).forEach((childRecordType) => {
                            let childFields = fieldMap[childRecordType.recordTypeId];
                            (childRecordType.children as any[]).forEach((childObject) => {
                                listElements.push(self.createListElement(childFields, childObject));
                            });
                        });
                    }
                    return listElements;
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

    async showChildCustomObjectDetailsCard(childRecordType: RecordType, parentRecordType: RecordType, parentId: string, fieldMap: { [key: string]: Field[] }) {
        // Außerdem noch Testfälle für diesen Murks erstellen
        let self = this;
        let childDetailsCard = new Card(self.webApp, "");
        childDetailsCard.HtmlElement.classList.add("detailscard");
        let childFields = fieldMap[childRecordType._id as string];
        let titleField = childFields.find((f) => f.isTitle);
        let title: string;

        let detailsSectionConfig: DetailsSectionConfig = { };
        // CREATE
        let propertyElements = childFields.map((f) => {
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
                obj.parent = { recordTypeId: parentRecordType._id, parentId: parentId };
            });
            let createdObject = await new GenericApi(childRecordType.name).save(obj);
            let title = titleField ? createdObject[titleField.name] : "";
            self.webApp.toast.show("Das Objekt '" + title + "' wurde erstellt.");
            self.childrenListSection.add(self.createListElement(childFields, createdObject));
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
        let allFields = await new Api(Field).getAll();
        let fieldMap: { [key: string]: Field[] } = { };
        allFields.forEach(f => {
            if (!fieldMap[f.recordTypeId as string]) {
                fieldMap[f.recordTypeId as string] = [];
            }
            fieldMap[f.recordTypeId as string].push(f);
        });
        let fieldsOfRecordType = fieldMap[recordType._id as string];
        self.customObjectsListCard = new Card(self.webApp, recordType.label, recordType.name + "/");
        self.customObjectsListCard.HtmlElement.classList.add("listcard");

        self.customObjectsListCard.onClose = () => {
            menuItem.listElement!.button!.HtmlElement.classList.remove("selected");
            self.webApp.setSubUrl("");
        }

        self.customObjectsListCardListSection = new ListSection({

            onAdd: async () => {
                self.webApp.cardStack.closeCardsRightTo(self.customObjectsListCard);
                self.showCustomObjectDetailsCard(recordType, fieldMap);
            },

            onSelect: async (listElement) => {
                self.webApp.cardStack.closeCardsRightTo(self.customObjectsListCard);
                self.showCustomObjectDetailsCard(recordType, fieldMap, listElement.entity._id as string);
            },

            loadListElements: async () => {
                let objects = await new GenericApi(recordType.name).getAll();
                return objects.map((o) => { return self.createListElement(fieldsOfRecordType, o); });
            }

        });
        self.customObjectsListCard.addSection(self.customObjectsListCardListSection);
        await self.customObjectsListCardListSection.load();

        self.webApp.cardStack.setSingleCard(self.customObjectsListCard);

        if (subUrl && subUrl.length > recordType.name.length + 1) {
            let id = subUrl.substring(recordType.name.length + 1);
            self.customObjectsListCardListSection.select(id);
            self.showCustomObjectDetailsCard(recordType, fieldMap, id);
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