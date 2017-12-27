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
            detailsSectionConfig.onSave = async () => {
                let recordType = {
                    _id: id,
                    label: labelPropertyElement.value,
                    showInMenu: showInMenuPropertyElement.value
                } as RecordType;
                await self.webApp.api(RecordType).save(recordType);
                self.webApp.mainMenu.load();
                self.webApp.toast.show("Änderungen gespeichert.");
                await self.showListCard("RecordType/" + id);
            };
            detailsSectionConfig.onDelete = async () => {
                if (confirm('Soll der RecordType wirklich gelöscht werden?')) {
                    await self.webApp.api(RecordType).delete(id);
                    self.recordTypeDetailsCard.close();
                    self.webApp.mainMenu.load();
                    self.webApp.toast.show("Der RecordType wurde gelöscht.");
                    await self.showListCard("RecordType/");
                }
            };
            detailsSectionConfig.loadProperties = async () => {
                let recordType = await self.webApp.api(RecordType).getOne(id);
                self.recordTypeDetailsCard.Title.HtmlElement.innerHTML = (recordType.label ? recordType.label : recordType.name);
                let namePropertyElement: PropertyElement = { label: "Name", type: FieldType.Label, value: recordType.name };
                labelPropertyElement.value = recordType.label;
                showInMenuPropertyElement.value = recordType.showInMenu;
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
                promise.then((createdRecordType) => {
                    if (createdRecordType.showInMenu) self.webApp.mainMenu.load();
                    self.webApp.toast.show("Der RecordType '" + namePropertyElement.value + "' wurde erstellt.");
                    return self.showListCard("RecordType/" + createdRecordType._id);
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

    async showListCard(subUrl?: string) {
        let self = this;
        self.recordTypesListCard = new Card(self.webApp, "Benutzerdefinierte Objekte", "RecordType/");
        self.recordTypesListCard.HtmlElement.classList.add("listcard");

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
                return recordTypes.map((rt) => { return {
                    entity: rt,
                    firstLine: rt.label,
                    iconUrl: "categorize.png",
                    secondLine: rt.name
                } });
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
        webApp.mainMenu.menuHandlers.push({
            async load() {
                let menuItems: MenuItem[] = [];
    
                menuItems.push({
                    label: "Benutzerdefinierte Objekte",
                    iconUrl: "categorize.png",
                    section: "Einstellungen",
                    onClick: async (subUrl) => {
                        self.showListCard(subUrl);
                    },
                    subUrl: "RecordType/"
                });
    
                return menuItems;
            }
        });
    }

}