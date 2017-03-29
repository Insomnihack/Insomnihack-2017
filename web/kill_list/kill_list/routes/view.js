'use strict';

const _ = require('lodash');

let  _req, _res;

// build html for flash messages. 
function renderFlashMsg() {
    let flash = _req.flash(),
        out   = '',
        types = ['success', 'error', 'info'];

    _.each(types, (type) => {
        if (flash[type]) {
            out += '<div class="flash-msgs '+ type +'">';
            out += '<h2><span>' + type + '</span></h2>';
            out += '<ul>';

            _.each(flash[type], (msg) => {
                out += `<li>${msg}</li>`;
            }) ;
            console.log(msg);
            out += '</ul></div>';
        }
    });

    return out;
}

module.exports = {
    'setContext': (req, res, next) => {
        _req = req;
        _res = res;
        next();
    },
    'helpers': {
        renderFlashMsg
    }
};