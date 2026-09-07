import React from 'react';
import { renderToString } from 'react-dom/server';
import AtlasOSApp from './apps/web/app/page.jsx';
console.log(renderToString(<AtlasOSApp />));
