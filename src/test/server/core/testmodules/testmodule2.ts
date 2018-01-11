import { Type } from "../../../../common/types/type";
import { Module } from "../../../../server/core/module";

class TestModule2 extends Type {}

export default Module.create((app) => {

    // app.registerDefaultApi(TestModule2)

})
