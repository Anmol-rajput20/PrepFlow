const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();

exports.checkDeadlines = onSchedule(
  {
    schedule: "every 1 hours",
    timeZone: "Asia/Kolkata",
  },
  async () => {
    const db = admin.firestore();
    const today = new Date().toISOString().split("T")[0];

    const usersSnapshot = await db.collection("users").get();

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
          if (task.completed || !task.deadline) continue;

          if (task.deadline <= today) {
            await admin.messaging().send({
              token,
              notification: {
                title: "⏰ PrepFlow Reminder",
                body: `${task.name} is due or overdue in ${area.name}.`,
              },
            });
          }
        }
      }
    }

    return null;
  }
);