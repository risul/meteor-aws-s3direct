Package.describe({
    name: 'risul:aws-s3direct',
    summary: 'Meteor package for generating s3 Upload and Download Policies for direct upload/download',
    version: '1.1.0',
    git: 'https://github.com/risul/meteor-aws-s3direct'
});

Npm.depends({
    "mime": '1.3.4'
});

Package.on_use(function (api) {
    api.versionsFrom('METEOR@1.0');
    api.export('s3Direct');
    api.export('mime');
    api.add_files('lib/s3Direct.js', 'server');
});