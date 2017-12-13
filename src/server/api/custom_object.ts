import { RecordType } from "../../common/types/recordtype";
import { Field, FieldType } from "../../common/types/field";
import { App } from "../core/app";
import { UserRequest } from "../../common/types/user";
import { Collection } from "mongodb";
import { ObjectId } from "bson";
import Utils from "../core/utils";

export default (app: App): void => {

    app.router.get('/:recordTypeName', async (req: UserRequest, res) => {
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        // Filter only configured fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id.toString() }).toArray();
        let fieldFilter:any = {};
        fields.forEach(f => fieldFilter[f.name] = 1);
        let records = await Utils.getCustomObjectCollection(req, recordType.name).aggregate([ { $project : fieldFilter } ]).toArray();
        res.send(records);
    })

    app.router.get('/:recordTypeName/:id', async (req: UserRequest, res) => {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        // Filter only configured fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id.toString() }).toArray();
        let fieldFilter:any = {};
        fields.forEach(f => fieldFilter[f.name] = 1);
        let records = await Utils.getCustomObjectCollection(req, recordType.name).aggregate([
            { $match : { _id : new ObjectId(req.params.id) } },
            { $project : fieldFilter }
        ]).toArray();
        if (records.length < 1) {
            res.sendStatus(404);
            return;
        }
        res.send(records[0]);
    })

}