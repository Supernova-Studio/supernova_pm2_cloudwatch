const AWS = require("aws-sdk");

function CloudwatchDestination(
    awsRegion,
    awsAccessKey,
    awsSecretKey,
    cloudwatchNamespace,
    cloudwatchRestartMetricName,
) {

    this.getCloudwatch = function () {
        var cw = new AWS.CloudWatch({
            accessKeyId: awsAccessKey,
            secretAccessKey: awsSecretKey,
            region: awsRegion,
        });
        return cw
    }

    this.pushMetric = function (metricData) {
        var cw = this.getCloudwatch();

        var promise = cw
            .putMetricData({
                MetricData: metricData,
                Namespace: cloudwatchNamespace
            })
            .promise();

        promise.catch(function (error) {
            console.error(error, "Error pushing metric")
        });
    }

    this.notifyRestart = function (processData) {
        var metric = [{
            MetricName: cloudwatchRestartMetricName,
            Value: 1, //+processData.restart_time,
            Unit: "Count"
        }];
        this.pushMetric(metric);
    };
}

module.exports = CloudwatchDestination
