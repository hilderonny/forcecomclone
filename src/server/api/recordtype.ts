import { RecordType } from "../../common/types/recordtype";
import { App } from "../core/app";
import { UserRequest } from "../../common/types/user";
import { Collection } from "mongodb";

export default (app: App): void => {

    function getCollection(req: UserRequest): Collection<RecordType> {
        let db = req.user!.db;
        return db.collection<RecordType>(RecordType.name);
    }

    app.router.get('/RecordType', async (req: UserRequest, res) => {
        let recordTypes = await getCollection(req).find({}).toArray();
        res.send(recordTypes);
    })

}