const bcrypt = require('bcrypt')

module.exports = [
    {
        username: 'Anna',
        password: bcrypt.hashSync('1234', 12)
    },
    {
        username: 'EatCake',
        password: bcrypt.hashSync('5556', 12) 
    },
    {
        username: 'DanEats123',
        password: bcrypt.hashSync('9956', 12)
    },
    {
        username: 'MargeCooks',
        password: bcrypt.hashSync('6767', 12)
    },
    {
        username: 'JulesSummer',
        password: bcrypt.hashSync('11558', 12)
    },
    {
        username: 'Michael64OL',
        password: bcrypt.hashSync('1964', 12)
    },
    {
        username: 'MichelleS',
        password: bcrypt.hashSync('2024', 12)
    },
    {
        username: 'PastaLover',
        password: bcrypt.hashSync('3000', 12)
    }
]