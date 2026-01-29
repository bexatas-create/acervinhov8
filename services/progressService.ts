
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  collection, 
  query, 
  where, 
  serverTimestamp,
  increment,
  addDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from '../firebase';

export interface LessonProgress {
  completed: boolean;
  lastWatched: any;
  courseId: string;
  blockId: string;
}

export interface CourseProgress {
  progressPercent: number;
  lastAccessed: {
    blockId: string;
    lessonId: string;
    timestamp: any;
  } | null;
}

export const progressService = {
  async updateLastAccessed(uid: string, courseId: string, blockId: string, lessonId: string) {
    const courseRef = doc(db, `userProgress/${uid}/courses/${courseId}`);
    await setDoc(courseRef, {
      lastAccessed: {
        blockId,
        lessonId,
        timestamp: serverTimestamp()
      }
    }, { merge: true });
  },

  async toggleLessonStatus(uid: string, courseId: string, blockId: string, lessonId: string, markAsCompleted: boolean) {
    const lessonRef = doc(db, `userProgress/${uid}/lessons/${lessonId}`);
    const blockRef = doc(db, `userProgress/${uid}/courses/${courseId}/blocks/${blockId}`);
    const courseRef = doc(db, `userProgress/${uid}/courses/${courseId}`);

    await setDoc(lessonRef, {
      courseId,
      blockId,
      completed: markAsCompleted,
      lastWatched: serverTimestamp()
    }, { merge: true });

    await setDoc(blockRef, {
      completedLessons: increment(markAsCompleted ? 1 : -1)
    }, { merge: true });

    await updateDoc(courseRef, {
      lastUpdate: serverTimestamp()
    }).catch(() => {});
  },

  async updateUserPreference(uid: string, mode: 'live' | 'recorded') {
    const profileRef = doc(db, "profiles", uid);
    await updateDoc(profileRef, {
      preferredCourseMode: mode,
      onboardingCompleted: true
    });
  },

  // Schedules (Humanizando feature)
  async saveGeneratedSchedule(uid: string, courseId: string, scheduleData: any) {
    const scheduleRef = doc(db, `userProgress/${uid}/schedules/${courseId}`);
    await setDoc(scheduleRef, {
      ...scheduleData,
      updatedAt: serverTimestamp()
    });
  },

  async getGeneratedSchedule(uid: string, courseId: string) {
    const docRef = doc(db, `userProgress/${uid}/schedules/${courseId}`);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  },

  async resetSchedule(uid: string, courseId: string) {
    const docRef = doc(db, `userProgress/${uid}/schedules/${courseId}`);
    await deleteDoc(docRef);
  },

  // Simulations
  async saveSimulationResult(uid: string, courseId: string, result: any) {
    const simRef = collection(db, `userProgress/${uid}/simulations`);
    await addDoc(simRef, {
      ...result,
      courseId,
      timestamp: serverTimestamp()
    });
  },

  async getSimulationHistory(uid: string, courseId: string) {
    const simRef = collection(db, `userProgress/${uid}/simulations`);
    const q = query(simRef, where("courseId", "==", courseId));
    const snap = await getDocs(q);
    const history: any[] = [];
    snap.forEach(doc => history.push({ id: doc.id, ...doc.data() }));
    return history.sort((a: any, b: any) => b.timestamp?.seconds - a.timestamp?.seconds);
  },

  async getCourseProgress(uid: string, courseId: string): Promise<CourseProgress | null> {
    const docRef = doc(db, `userProgress/${uid}/courses/${courseId}`);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() as CourseProgress : null;
  },

  async getBlocksProgress(uid: string, courseId: string) {
    const blocksRef = collection(db, `userProgress/${uid}/courses/${courseId}/blocks`);
    const snap = await getDocs(blocksRef);
    const progress: Record<string, any> = {};
    snap.forEach(doc => {
      progress[doc.id] = doc.data();
    });
    return progress;
  },

  async getStudentStats(uid: string) {
    const lessonsRef = collection(db, `userProgress/${uid}/lessons`);
    const q = query(lessonsRef, where("completed", "==", true));
    const lessonsSnap = await getDocs(q);
    const totalWatched = lessonsSnap.size;

    const coursesRef = collection(db, `userProgress/${uid}/courses`);
    const coursesSnap = await getDocs(coursesRef);
    const coursesCount = coursesSnap.size;

    return {
      totalWatched,
      coursesCount,
      studyTime: Math.floor(totalWatched * 15 / 60) + "h" 
    };
  }
};
