function inherit(parent, child) {
    for (var attr in parent)
        if (child[attr] == undefined) 
            child[attr] = parent[attr]       
    return child
}

//a is b
function is(a, b) {
    for (var attr in b)
        if (a[attr] == undefined)
            return false
    return true
}

function MyObject() { //Must call MyObject
    return {
        str: function () { return 'object' }, //toString is in _proto_, that could make some problems
        equals: function () { return false }
    }
}

//class Person constructor
function Person(inputName) {
    //construct field
    return inherit(MyObject(), {
        name: inputName,
        height: 0,
        printName: function () {
            console.log(this.name)
        },
        str: function () { return this.name} //override
    })
}

//class Student constructor
function Student() {
    //construct field
    return inherit(Person('default'), {
        grade: 0,
        str: function () { return this.name } //override
    })
}

