import React from 'react';
import { renderToString } from 'react-dom/server';
import AtlasOSApp from './app/page.jsx';
console.log(renderToString(<AtlasOSApp />));
