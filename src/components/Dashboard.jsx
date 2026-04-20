import React, { useState } from "react";
import WorkArea from "./WorkArea";
import "./Dashboard.css";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import {db} from "../firebase";
import { useEffect } from "react";
import {collection, addDoc, getDocs, doc, deleteDoc,setDoc} from "firebase/firestore";
import {messaging} from "../firebase-messaging";
import {getToken} from "firebase/messaging";


function Dashboard() {
  const [workAreas, setWorkAreas] = useState([]);
  
  const {user} = useUser();
  const [newName, setNewName] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");

  useEffect(() => {
    const fetchWorkAreas = async () => {
      try{
        if (!user) return;
        const snapshot = await getDocs(collection(db, "users",user.id,"workAreas"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
         
        }));

        setWorkAreas(data);
      } catch(err) {
        console.error(err);
      }
    };

    fetchWorkAreas();
  }, [user]);

  useEffect(() => {
    if (user) {
      requestPermission();
    }
  }, [user]);

  

  const addWorkArea = async () => {
    if(!newName) return;

    try{
      const docRef = await addDoc(collection(db,"users",user.id,"workAreas"), {
        name : newName,
        priority: newPriority,
        tasksArray: [],
        createdAt : new Date(),
      });

      console.log("Data sent to Firestore");

      const newArea = {
        id : docRef.id,
        name : newName,
        priority : newPriority,
        tasksArray: [],
      };

      setWorkAreas([newArea, ...workAreas]);

      setNewName("");
      setNewPriority("Medium");
    }catch(err) {
      console.error(err);
    }
  };

  const deleteWorkArea =  async (id) => {
    try{
      await deleteDoc(doc(db,"users",user.id,"workAreas",id));
    
      setWorkAreas(workAreas.filter((area) => area.id !== id));
    } catch(err) {
      console.error(err);
    }
  };

  const requestPermission = async () => {
    try{
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BJsbafzFhF9QX7BLfMgCEUd2xKHH15Om6EeiZ6tt3V5k8VOYib2UbCrh6k16WWSMOuDlfiwCKbixaUgqMHwYAr8",
        });

        console.log("FCM token: ",token);

        if(user?.id){
          await setDoc(
            doc(db,"users",user.id),
            {fcmToken: token},
            {merge: true}
          );
        }
      } else{
        console.log("Permission denied");
      }
    } catch(err) {
      console.error(err);
    }
  };



  return (
    <>
      {/* Hero Header */}
      <div className="hero-section">
        <div className="hero-card">
          {/* Left side */}
          <div className="hero-left">
            <div className="hero-icon">📘</div>

            <div className="hero-text">
              <h1>PrepFlow</h1>
              <p>Organize your work areas and conquer your goals! 🎯</p>
            </div>
          </div>

          {/* Right side auth */}
          <div className="hero-right">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="signin-btn">Sign In</button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="signup-btn">Sign Up</button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="user-info">
                <span className="welcome-text">
                  Welcome, {user?.firstName || user?.username || "User"} 👋
                </span>
                <UserButton/>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-container">
        {/* Add Work Area */}
        <div className="add-work-area-card">
          <div className="section-title">
            <div className="plus-icon">＋</div>
            <h2>Add New Work Area</h2>
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Enter work area name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <button onClick={addWorkArea}>+ Add Work Area</button>
          </div>
        </div>

        {/* Work Areas / Empty State */}
        {workAreas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <h2>No work areas yet</h2>
            <p>
              Start by adding a work area above to organize your tasks and track
              your progress.
            </p>
          </div>
        ) : (
          <div className="work-areas-list">
            {workAreas.map((area) => (
              <WorkArea
                key={area.id}
                data={area}
                docId={area.id}
                userId={user?.id}
                onDelete={deleteWorkArea}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;