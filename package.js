Package.describe({
    name: 'risul:aws-s3direct',
    summary: 'Meteor package for generating s3 Upload policy and file url for direct upload/view of files',
    version: '1.1.3',
    git: 'https://github.com/risul/meteor-aws-s3direct'
});

Npm.depends({
    "mime": '1.3.4'
});

Package.on_use(function (api) {
    api.versionsFrom('METEOR@1.0');
    api.use("risul:aws-sdk@1.0.6", "server")
    api.export('s3Direct');
    api.export('mime');
    api.add_files('lib/s3Direct.js', 'server');
});