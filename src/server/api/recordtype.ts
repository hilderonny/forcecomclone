import { Router } from "express"
import { RecordType } from "../../common/types/recordtype";

export default (router: Router): void => {

    router.post('/_RecordType', async(req, res) => {
        let recordTypeToCreate = req.body as RecordType
    })

}