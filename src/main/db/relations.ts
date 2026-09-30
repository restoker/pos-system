import { defineRelations, defineRelationsPart } from 'drizzle-orm'
import * as schema from './schema'

export const userRelations = defineRelations(schema, (r) => ({}))

// export const part = defineRelationsPart(schema, (r) => ({

// }));
