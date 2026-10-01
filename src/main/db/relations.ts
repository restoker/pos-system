import { defineRelations } from 'drizzle-orm'
// import {} from './schema';
import {user, account, session, verification} from './auth-schema'

export const userRelations = defineRelations({user, account, session, verification}, (r) => ({
     user: {
        sessions: r.many.session({
            from: r.user.id,
            to: r.session.userId
        }),
        accounts: r.many.account({
            from: r.user.id,
            to: r.account.userId
        })
    },
}))
