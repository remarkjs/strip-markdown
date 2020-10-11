import remark = require('remark')
import strip = require('strip-markdown')

remark().use(strip)
remark().use(strip, {keep: []})
remark().use(strip, {keep: [`table`]})

remark().use(strip, {keep: [`typo`]}) // $ExpectError
