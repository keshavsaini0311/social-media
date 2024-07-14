import cron from "cron";
import https from "https";

const URL = "https://social-media-9ll3.onrender.com/";

const job = new cron.CronJob("*/5 * * * *", function () {
	https
		.get(URL, (res) => {
			if (res.statusCode === 200) {
				console.log("GET request sent successfully");
			} else {
				console.log("GET request failed", res.statusCode);
			}
		})
		.on("error", (e) => {
			console.error("Error while sending request", e);
		});
});

export default job;