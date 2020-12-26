function getValue(el) {
    if (el.nodeName === 'INPUT') {
        let type = el.getAttribute('type').toLowerCase();
        switch (type) {
            case 'checkbox':
                return el.checked;
            case 'text':
                return el.value;
        }
    }
    return undefined;
}

function parseAttributes(el, context) {
    if (!el.hasAttributes()) return false;

    for (let i = 0; i < el.attributes.length; i++) {
        let a = el.attributes[i];
        if (a.name.charAt(0) === ':') {
            let name = a.name.substr(1);
            switch (name) {
                case 'text':
                    context[a.value] = el.textContent;
                    break;
                case 'value':
                    context[a.value] = getValue(el);
                    break;
                case 'for': // Scan all children
                    const children = [];
                    for (let c = 0; c < el.children.length; c++) {
                        let childContext = {};
                        parseDom(el.children[c], childContext)
                        children.push(childContext);
                    }
                    context[a.value] = children;
                    return true;
            }
        }
    }
    return false;
}

function parseDom(el, context) {
    if (el == null) return;

    let it = el.firstChild;
    while (it != null) {
        if (it.nodeType === Node.ELEMENT_NODE) {
            const cont = parseAttributes(it, context);
            if (!cont)
                parseDom(it, context);
        }
        it = it.nextSibling
    }
}

const root = {};
parseDom(document.body, root);
console.log('Context extracted', root);