var config = {
    app_name: "Human kill list",
    redis: {
        pass: 'passw0rd',
        host: '127.0.0.1',
        port: 6379,
        db: 1
    },
    session: {
        secret: '4J8EIBxlARPhoJfQxBrgNTzcR3bAdXAV3D7AsfPFUN9aJFnghdO4Gs2hrX4F6DiijgZ6ToA7s3Eqd22VCA1muvHykwf5eJnN2Czo',
        name: "sessionID"
    },
    mongodb: {
        url: "mongodb://skynet:passw0rd@127.0.0.1:27017/skynet"
    }
}

module.exports = config;
