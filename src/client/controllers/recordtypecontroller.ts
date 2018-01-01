import { Controller } from "./controller";
import { WebApp } from "../webapp";
import { MenuItem } from "../elements/mainmenu";
import { Card } from "../elements/card";
import { ListSection, DetailsSection, DetailsSectionConfig, PropertyElement, ListElement } from "../elements/section";
import { RecordType } from "../../common/types/recordtype";
import { FieldType, Field } from "../../common/types/field";

export class RecordTypeController extends Controller {

    webApp: WebApp;
    recordTypesListCard: Card;
    recordTypeDetailsCard: Card;
    recordTypesListCardListSection: ListSection<RecordType>;
    recordTypeMenuItem: MenuItem;
    fieldDetailsCard: Card;
    fieldsListSection: ListSection<Field>;

    async showRecordTypeDetailsCard(id?: string) {
        let self = this;
        let subUrl = "RecordType/" + (id ? id : "");
        self.recordTypeDetailsCard = new Card(self.webApp, "", subUrl);
        self.recordTypeDetailsCard.HtmlElement.classList.add("detailscard");

        let detailsSectionConfig: DetailsSectionConfig = { };
        if (id) {
            // EDIT
            // Detailssection
            let labelPropertyElement: PropertyElement = { label: "Bezeichnung", type: FieldType.Text, value: "" };
            let showInMenuPropertyElement: PropertyElement = { label: "In Menü zeigen", type: FieldType.CheckBox, value: false };
            let originalRecordType: RecordType;
            detailsSectionConfig.sectionTitle = "Details";
            detailsSectionConfig.onSave = async () => {
                let updatedRecordType = {
                    _id: id,
                    label: labelPropertyElement.value,
                    showInMenu: showInMenuPropertyElement.value
                } as RecordType;
                await self.webApp.api(RecordType).save(updatedRecordType);
                self.webApp.toast.show("Änderungen gespeichert.");
                if (updatedRecordType.label !== originalRecordType.label) {
                    let listElement = self.recordTypesListCardListSection.listElements.find((el) => { return el.entity._id === id; });
                    if (listElement) {
                        self.recordTypesListCardListSection.remove(listElement);
                        listElement.firstLine = updatedRecordType.label;
                        self.recordTypesListCardListSection.add(listElement);
                        self.recordTypesListCardListSection.select(id);
                    }
                }
                if (updatedRecordType.label !== originalRecordType.label || updatedRecordType.showInMenu !== originalRecordType.showInMenu) {
                    await self.webApp.mainMenu.load();
                    self.recordTypeMenuItem.select!();
                }
                originalRecordType = updatedRecordType;
            };
            detailsSectionConfig.onDelete = async () => {
                if (confirm('Soll der RecordType wirklich gelöscht werden?')) {
                    await self.webApp.api(RecordType).delete(id);
                    self.recordTypeDetailsCard.close();
                    self.webApp.toast.show("Der RecordType wurde gelöscht.");
                    let listElement = self.recordTypesListCardListSection.listElements.find((el) => { return el.entity._id === id; });
                    if (listElement) self.recordTypesListCardListSection.remove(listElement);
                    if (originalRecordType.showInMenu) {
                        await self.webApp.mainMenu.load();
                        self.recordTypeMenuItem.select!();
                    }
                    self.webApp.setSubUrl("RecordType/");
                }
            };
            detailsSectionConfig.loadProperties = async () => {
                originalRecordType = await self.webApp.api(RecordType).getOne(id);
                self.recordTypeDetailsCard.Title.HtmlElement.innerHTML = (originalRecordType.label ? originalRecordType.label : originalRecordType.name);
                let namePropertyElement: PropertyElement = { label: "Name", type: FieldType.Label, value: originalRecordType.name };
                labelPropertyElement.value = originalRecordType.label;
                showInMenuPropertyElement.value = originalRecordType.showInMenu;
                return [ namePropertyElement, labelPropertyElement, showInMenuPropertyElement ];
            };
        } else {
            // CREATE
            let namePropertyElement: PropertyElement = { label: "Name", type: FieldType.Text, value: "" };
            let labelPropertyElement: PropertyElement = { label: "Bezeichnung", type: FieldType.Text, value: "" };
            let showInMenuPropertyElement: PropertyElement = { label: "In Menü zeigen", type: FieldType.CheckBox, value: false };
            detailsSectionConfig.onCreate = async () => {
                let recordType = {
                    name: namePropertyElement.value,
                    label: labelPropertyElement.value,
                    showInMenu: showInMenuPropertyElement.value
                } as RecordType;
                let promise = self.webApp.api(RecordType).save(recordType);
                promise.then(async (createdRecordType) => {
                    self.webApp.toast.show("Der RecordType '" + namePropertyElement.value + "' wurde erstellt.");
                    await self.recordTypesListCardListSection.add(self.createRecordTypeListElement(createdRecordType));
                    self.recordTypeDetailsCard.close();
                    await self.showRecordTypeDetailsCard(createdRecordType._id);
                    self.recordTypesListCardListSection.select(createdRecordType._id);
                    if (createdRecordType.showInMenu) {
                        await self.webApp.mainMenu.load();
                        self.recordTypeMenuItem.select!();
                    }
                }, (statusCode: number) => {
                    if (statusCode === 409) {
                        namePropertyElement.property!.setErrorMessage("Dieser Name ist bereits vergeben und kann nicht verwendet werden.");
                    }
                });
            };
            detailsSectionConfig.loadProperties = async () => {
                return [ namePropertyElement, labelPropertyElement, showInMenuPropertyElement ];
            };
            detailsSectionConfig.validate = async () => {
                let name = namePropertyElement.value as string;
                if (!name || 
                    name.length < 1 ||
                    name.includes('__') ||
                    name.match(/[\W]/) ||
                    !name.match(/^[A-Za-z]/) ||
                    [ "RecordType", "Field" ].includes(name)
                ) {
                    namePropertyElement.property!.setErrorMessage("Name muss mit Buchstaben beginnen, darf nur Buchstaben (ohne Umlaute), Ziffern und '_' enthalten, darf nicht '__' enthalten und darf weder 'RecordType' noch 'Field' lauten.");
                    return false;
                }
                return true;
            };
        }
        let detailsSection = new DetailsSection(detailsSectionConfig);
        self.recordTypeDetailsCard.addSection(detailsSection);
        await detailsSection.load();

        // Field list section
        if (id) {
            self.fieldsListSection = new ListSection<Field>({
                sectionTitle: "Felder",
                onAdd: async () => {
                    self.webApp.cardStack.closeCardsRightTo(self.recordTypeDetailsCard);
                    self.showFieldDetailsCard(id);
                },
                onSelect: async (listElement) => {
                    self.webApp.cardStack.closeCardsRightTo(self.recordTypeDetailsCard);
                    self.showFieldDetailsCard(id, listElement.entity._id);
                },
                loadListElements: async () => {
                    let fields = await this.webApp.api(Field).getAll('/forRecordType/' + id);
                    return fields.map((field) => { return self.createFieldListElement(field); });
                }
            });
            self.recordTypeDetailsCard.addSection(self.fieldsListSection);
            await self.fieldsListSection.load();
        }

        self.recordTypeDetailsCard.onClose = () => {
            self.recordTypesListCardListSection.select();
            self.webApp.setSubUrl("RecordType/");
        };

        self.webApp.cardStack.addCard(self.recordTypeDetailsCard);
    }

    async showFieldDetailsCard(recordTypeId: string, id?: string) {
        let self = this;
        self.fieldDetailsCard = new Card(self.webApp, "", "RecordType/" + recordTypeId);
        self.fieldDetailsCard.HtmlElement.classList.add("detailscard");

        let namePropertyElement: PropertyElement = { label: "Name", type: FieldType.Text, value: "" };
        let labelPropertyElement: PropertyElement = { label: "Bezeichnung", type: FieldType.Text, value: "" };
        let typePropertyElement: PropertyElement = { label: "Typ", type: id ? FieldType.Label : FieldType.SelectBox, value: FieldType.Text, options: Object.keys(FieldType) };
        let isTitlePropertyElement: PropertyElement = { label: "Listentitel", type: FieldType.CheckBox, value: false };

        let detailsSectionConfig: DetailsSectionConfig = { };
        if (id) {
            // EDIT
            let originalField: Field;
            detailsSectionConfig.onSave = async () => {
                let updatedField = {
                    _id: id,
                    label: labelPropertyElement.value,
                    isTitle: isTitlePropertyElement.value
                } as Field;
                await self.webApp.api(Field).save(updatedField);
                self.webApp.toast.show("Änderungen gespeichert.");
                if (updatedField.label !== originalField.label || updatedField.type !== originalField.type) { // TODO: Icon depending on type
                    let listElement = self.fieldsListSection.listElements.find((el) => { return el.entity._id === id; });
                    if (listElement) {
                        self.fieldsListSection.remove(listElement);
                        listElement.firstLine = updatedField.label;
                        self.fieldsListSection.add(listElement);
                        self.fieldsListSection.select(id);
                    }
                }
                originalField = updatedField;
            };
            detailsSectionConfig.onDelete = async () => {
                if (confirm('Soll das Feld wirklich gelöscht werden?')) {
                    await self.webApp.api(Field).delete(id);
                    self.fieldDetailsCard.close();
                    self.webApp.toast.show("Das Feld wurde gelöscht.");
                    let listElement = self.fieldsListSection.listElements.find((el) => { return el.entity._id === id; });
                    if (listElement) self.fieldsListSection.remove(listElement);
                }
            };
            detailsSectionConfig.loadProperties = async () => {
                originalField = await self.webApp.api(Field).getOne(id);
                self.fieldDetailsCard.Title.HtmlElement.innerHTML = (originalField.label ? originalField.label : originalField.name);
                let namePropertyElement: PropertyElement = { label: "Name", type: FieldType.Label, value: originalField.name };
                labelPropertyElement.value = originalField.label;
                typePropertyElement.value = originalField.type;
                isTitlePropertyElement.value = originalField.isTitle;
                return [ namePropertyElement, labelPropertyElement, typePropertyElement, isTitlePropertyElement ];
            };
        } else {
            // CREATE
            detailsSectionConfig.onCreate = async () => {
                let field = {
                    name: namePropertyElement.value,
                    label: labelPropertyElement.value,
                    type: typePropertyElement.value,
                    isTitle: isTitlePropertyElement.value,
                    recordTypeId: recordTypeId
                } as Field;
                let promise = self.webApp.api(Field).save(field);
                promise.then(async (createdField) => {
                    self.webApp.toast.show("Das Feld '" + namePropertyElement.value + "' wurde erstellt.");
                    await self.fieldsListSection.add(self.createFieldListElement(createdField));
                    self.fieldDetailsCard.close();
                    await self.showFieldDetailsCard(recordTypeId, createdField._id);
                    self.fieldsListSection.select(createdField._id);
                }, (statusCode: number) => {
                    if (statusCode === 409) {
                        namePropertyElement.property!.setErrorMessage("Dieser Name ist bereits vergeben und kann nicht verwendet werden.");
                    }
                });
            };
            detailsSectionConfig.loadProperties = async () => {
                return [ namePropertyElement, labelPropertyElement, typePropertyElement, isTitlePropertyElement ];
            };
            detailsSectionConfig.validate = async () => {
                let name = namePropertyElement.value as string;
                if (!name || 
                    name.length < 1 ||
                    name.includes('__') ||
                    name.match(/[\W]/) ||
                    !name.match(/^[A-Za-z]/) ||
                    [ "_id" ].includes(name)
                ) {
                    namePropertyElement.property!.setErrorMessage("Name muss mit Buchstaben beginnen, darf nur Buchstaben (ohne Umlaute), Ziffern und '_' enthalten, darf nicht '__' enthalten und darf nicht '_id' lauten.");
                    return false;
                }
                return true;
            };
        }
        let detailsSection = new DetailsSection(detailsSectionConfig);
        self.fieldDetailsCard.addSection(detailsSection);
        await detailsSection.load();

        self.fieldDetailsCard.onClose = () => {
            self.fieldsListSection.select();
        };

        // TODO: Select options list and card

        self.webApp.cardStack.addCard(self.fieldDetailsCard);
    }

    createRecordTypeListElement(recordType: RecordType): ListElement<RecordType> {
        return {
            entity: recordType,
            firstLine: recordType.label,
            iconUrl: "categorize.png",
            secondLine: recordType.name
        }
    }

    createFieldListElement(field: Field) {
        let iconFileName: string = "categorize.png";
        switch(field.type) {
            case FieldType.CheckBox: iconFileName = "Checked CheckBox.svg"; break;
            case FieldType.Label: iconFileName = "type.svg"; break;
            case FieldType.SelectBox: iconFileName = "List.svg"; break;
            case FieldType.Text: iconFileName = "Text Box.svg"; break;
        }
        return {
            entity: field,
            firstLine: field.label,
            iconUrl: iconFileName,
            secondLine: field.name
        }
    }

    async showListCard(subUrl?: string) {
        let self = this;
        self.recordTypesListCard = new Card(self.webApp, "Benutzerdefinierte Objekte", "RecordType/");
        self.recordTypesListCard.HtmlElement.classList.add("listcard");

        self.recordTypesListCard.onClose = () => {
            self.recordTypeMenuItem.listElement!.button!.HtmlElement.classList.remove("selected");
            self.webApp.setSubUrl("");
        }

        self.recordTypesListCardListSection = new ListSection({

            onAdd: async () => {
                self.webApp.cardStack.closeCardsRightTo(self.recordTypesListCard);
                self.showRecordTypeDetailsCard();
            },

            onSelect: async (listElement) => {
                self.webApp.cardStack.closeCardsRightTo(self.recordTypesListCard);
                self.showRecordTypeDetailsCard(listElement.entity._id);
            },

            loadListElements: async () => {
                let recordTypes = await this.webApp.api(RecordType).getAll();
                return recordTypes.map((rt) => { return self.createRecordTypeListElement(rt); });
            }

        });
        self.recordTypesListCard.addSection(self.recordTypesListCardListSection);
        await self.recordTypesListCardListSection.load();

        self.webApp.cardStack.setSingleCard(self.recordTypesListCard);

        // Check whether a record type was selected
        if (subUrl && subUrl.length > 11) {
            let id = subUrl.substring(11);
            self.recordTypesListCardListSection.select(id);
            self.showRecordTypeDetailsCard(id);
        }
    }
    
    async initialize(webApp: WebApp): Promise<void> {
        let self = this;
        self.webApp = webApp;
        self.recordTypeMenuItem = {
            label: "Benutzerdefinierte Objekte",
            iconUrl: "categorize.png",
            section: "Einstellungen",
            onClick: async () => {
                await self.showListCard();
            },
            subUrl: "RecordType/"
        };
        webApp.mainMenu.menuHandlers.push({
            async load() {
                return [ self.recordTypeMenuItem ];
            }
        });

        self.webApp.addSubUrlHandler({
            UrlPart: "RecordType/",
            Handler: async (completeSubUrl) => {
                await self.showListCard(completeSubUrl);
            }
        });

    }

}