import { Type } from '../../type'
import { Module } from '../../module'

class TestModule1 extends Type {}

export default Module.create((app) => {

    app.registerApi(TestModule1)

})
