var crypto = Npm.require('crypto');

mime = Npm.require('mime');

s3Direct = function (accessKey, secretKey) {
    if (!accessKey) accessKey = process.env.AWS_ACCESS_KEY_ID || Meteor.settings.AWS.accessKeyId;
    if (!secretKey) secretKey = process.env.AWS_SECRET_ACCESS_KEY || Meteor.settings.AWS.secretAccessKey;
    
    if (accessKey && secretKey) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
    } 
    
    else {
        throw new Meteor.Error(404, 'Please add your AWS access key & secret access key!');
    }
    

    this.getSignedUrl = function(key, bucket, expires) {
        var params = {Bucket: bucket, Key: key};
        
        if (expires) params.Expires = expires;
        
        var s3 = new AWS.S3();
        var url = s3.getSignedUrl('getObject', params);

        return url;
    };

    this.getWritePolicy = function(key, bucket, acl, duration, filesize, useEncryption, cb) {
        if (typeof useEncryption === 'function') {
            cb = useEncryption;
            useEncryption = false;
        }

        var contentType = mime.lookup(key);
        var dateObj = new Date;
        var dateExp = new Date(dateObj.getTime() + duration * 1000);
        var policy = {
            "expiration":dateExp.getUTCFullYear() + "-" + (dateExp.getUTCMonth() + 1) + "-" + dateExp.getUTCDate() + "T" + dateExp.getUTCHours() + ":" + dateExp.getUTCMinutes() + ":" + dateExp.getUTCSeconds() + "Z",
            "conditions":[
                { "bucket":bucket },
                ["eq", "$key", key],
                { "acl": acl },
                ["content-length-range", 0, filesize * 1000000],
                ["starts-with", "$Content-Type", contentType]
            ]
        };

        if(useEncryption) {
            policy.conditions.push({ 'x-amz-server-side-encryption': 'AES256' });
        }

        var policyString = JSON.stringify(policy);
        var policyBase64 = new Buffer(policyString).toString('base64');
        var signature = crypto.createHmac("sha1", this.secretKey).update(policyBase64);
        var accessKey = this.accessKey;

        var result = {
            url: "https://"+ bucket + ".s3.amazonaws.com",
            policyData: [
                {name: "key", value: key},
                {name: "Content-Type", value: contentType},
                {name: "AWSAccessKeyId", value: accessKey},
                {name: "bucket", value: bucket},
                {name: "acl", value: acl},
                {name: "policy", value: policyBase64},
                {name: "signature", value: signature.digest("base64")}
            ]
        };

        if (typeof cb === 'function') cb(null, result);

        return result;
    };
}