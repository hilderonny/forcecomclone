import { Controller } from "./controller";
import { WebApp } from "../webapp";
import { MenuItem } from "../elements/mainmenu";
import { Card } from "../elements/card";
import { ListSection, DetailsSection, DetailsSectionConfig, PropertyElement } from "../elements/section";
import { RecordType } from "../../common/types/recordtype";
import { FieldType } from "../../common/types/field";

export class RecordTypeController extends Controller {

    webApp: WebApp;
    recordTypesListCard: Card;
    recordTypeDetailsCard: Card;
    recordTypesListCardListSection: ListSection<RecordType>;
    recordTypeMenuItem: MenuItem;

    async showDetailsCard(id?: string) {
        let self = this;
        let subUrl = "RecordType/" + (id ? id : "");
        self.recordTypeDetailsCard = new Card(self.webApp, "", subUrl);
        self.recordTypeDetailsCard.HtmlElement.classList.add("detailscard");

        let detailsSectionConfig: DetailsSectionConfig<RecordType> = { };
        if (id) {
            // EDIT
            let labelPropertyElement: PropertyElement = { label: "Bezeichnung", type: FieldType.Text, value: "" };
            let showInMenuPropertyElement: PropertyElement = { label: "In Menü zeigen", type: FieldType.Checkbox, value: false };
            let originalRecordType: RecordType;
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
                    self.recordTypeMenuItem.select();
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
                        self.recordTypeMenuItem.select();
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
            let showInMenuPropertyElement: PropertyElement = { label: "In Menü zeigen", type: FieldType.Checkbox, value: false };
            detailsSectionConfig.onCreate = async () => {
                let recordType = {
                    name: namePropertyElement.value,
                    label: labelPropertyElement.value,
                    showInMenu: showInMenuPropertyElement.value
                } as RecordType;
                let promise = self.webApp.api(RecordType).save(recordType);
                promise.then(async (createdRecordType) => {
                    self.webApp.toast.show("Der RecordType '" + namePropertyElement.value + "' wurde erstellt.");
                    await self.recordTypesListCardListSection.add(self.createListElement(createdRecordType));
                    self.recordTypeDetailsCard.close();
                    await self.showDetailsCard(createdRecordType._id);
                    self.recordTypesListCardListSection.select(createdRecordType._id);
                    // TODO: Ggf. in Menü einblenden
                    if (createdRecordType.showInMenu) {
                        await self.webApp.mainMenu.load();
                        self.recordTypeMenuItem.select();
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

        self.recordTypeDetailsCard.onClose = () => {
            self.recordTypesListCardListSection.select();
            self.webApp.setSubUrl("RecordType/");
        };

        self.webApp.cardStack.addCard(self.recordTypeDetailsCard);
    }

    createListElement(recordType: RecordType) {
        return {
            entity: recordType,
            firstLine: recordType.label,
            iconUrl: "categorize.png",
            secondLine: recordType.name
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
                self.showDetailsCard();
            },

            onSelect: async (listElement) => {
                self.webApp.cardStack.closeCardsRightTo(self.recordTypesListCard);
                self.showDetailsCard(listElement.entity._id);
            },

            loadListElements: async () => {
                let recordTypes = await this.webApp.api(RecordType).getAll();
                return recordTypes.map((rt) => { return self.createListElement(rt); });
            }

        });
        self.recordTypesListCard.addSection(self.recordTypesListCardListSection);
        await self.recordTypesListCardListSection.load();

        self.webApp.cardStack.setSingleCard(self.recordTypesListCard);

        // Check whether a record type was selected
        if (subUrl && subUrl.length > 11) {
            let id = subUrl.substring(11);
            self.recordTypesListCardListSection.select(id);
            self.showDetailsCard(id);
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