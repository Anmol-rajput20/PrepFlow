const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.checkDeadlines = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async () => {
    const db = admin.firestore();

    const usersSnapshot = await db.collection("users").get();

    const today = new Date().toISOString().split("T")[0];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const token = userData.fcmToken;

      if (!token) continue;

      const workAreasSnapshot = await db
        .collection("users")
        .doc(userId)
        .collection("workAreas")
        .get();

      for (const areaDoc of workAreasSnapshot.docs) {
        const area = areaDoc.data();
        const tasks = area.tasksArray || [];

        for (const task of tasks) {
          if (task.completed) continue;

          if (task.deadline <= today) {
            const payload = {
              notification: {
                title: "⏰ Task Reminder",
                body: `${task.name} is due or overdue!`,
              },
            };

            await admin.messaging().sendToDevice(token, payload);
          }
        }
      }
    }

    return null;
  });