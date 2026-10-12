import fs from 'node:fs';
import {issues} from '../src/lib/escalations.ts';
fs.writeFileSync('data/synthetic-fixtures.json',JSON.stringify({synthetic:true,snapshot:'2026-09-28',issues},null,2));
