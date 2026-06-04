const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.html') && !file.endsWith('index.html') && !file.endsWith('category.html') && !file.endsWith('base.html') && !file.endsWith('subcategory.html')) {
            const content = fs.readFileSync(file, 'utf8');
            // get all script contents that do NOT have a src attribute
            const regex = /<script(?:(?!src).)*?>([\s\S]*?)<\/script>/gi;
            let match;
            let totalInlineScriptLen = 0;
            while ((match = regex.exec(content)) !== null) {
                totalInlineScriptLen += match[1].trim().length;
            }
            
            if (totalInlineScriptLen < 500) {
                results.push(file + ' (Script len: ' + totalInlineScriptLen + ')');
            }
        }
    });
    return results;
}

console.log(walk('C:\\Users\\tejas\\Desktop\\TRutiL_Studio_Offline\\tools').join('\n'));
