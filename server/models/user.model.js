import dynamoose from 'dynamoose';

const userSchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    status: {
        type: Object,
        schema: {
            hidden: {
                type: Boolean,
            },
            online: {
                type: Boolean,
            },
        },
        get: (value) => {
            return {
                online: value.hidden ? false : value.online,
            }
        },
        default: {
            hidden: false,
            online: false,
        },
    },
    friends: {
        type: Object,
        schema: {
            list: {
                type: Array,
                schema: [{
                    type: Object,
                    schema: {
                        id: {
                            type: String,
                            required: true,
                        },
                    },
                }],
                required: true,
            },
            requests: {
                type: Array,
                schema: [{
                    type: Object,
                    schema: {
                        id: {
                            type: String,
                            required: true,
                        },
                    },
                }],
                required: true,
            },
        },
        default: {
            list: [],
            requests: [],
        },
    },
    recommendations: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                id: {
                    type: String,
                    required: true,
                },
                songId: {
                    type: String,
                    required: true,
                },
            },
        }],
        default: [],
    },
}, {
    timestamps: true,
});

export default dynamoose.model('User', userSchema, {
    tableName: 'users',
});
