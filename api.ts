const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

type ApiRequestOptions = RequestInit & {
  authToken?: string | null;
};

async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const { authToken, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (fetchOptions.headers) {
    if (fetchOptions.headers instanceof Headers) {
      fetchOptions.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(fetchOptions.headers)) {
      fetchOptions.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, fetchOptions.headers as Record<string, string>);
    }
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  delete (fetchOptions as Record<string, unknown>).headers;

  if (fetchOptions.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data.data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  auth: {
    checkEmail: (email: string) =>
      apiRequest<{ exists: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`),
    signup: (payload: { name: string; email: string; password: string; role: string }) =>
      apiRequest<{ user: any; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    login: (payload: { email: string; password: string }) =>
      apiRequest<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  // Users
  getUsers: () => apiRequest<any[]>('/users'),
  getUserById: (id: string) => apiRequest<any>(`/users/${id}`),
  createUser: (userData: {
    name: string;
    email: string;
    role: string;
    password: string;
    phoneNumber?: string;
    address?: string;
  }) =>
    apiRequest<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  updateUser: (id: string, userData: Partial<{ name: string; email: string; role: string; phoneNumber?: string; address?: string }>) =>
    apiRequest<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  deleteUser: (id: string) =>
    apiRequest<any>(`/users/${id}`, {
      method: 'DELETE',
    }),

  // Courses
  getCourses: (params?: { instructorId?: string; category?: string; difficulty?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.instructorId) queryParams.append('instructorId', params.instructorId);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    const query = queryParams.toString();
    return apiRequest<any[]>(`/courses${query ? `?${query}` : ''}`);
  },
  getCourseById: (id: string) => apiRequest<any>(`/courses/${id}`),
  createCourse: (courseData: any) =>
    apiRequest<any>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
  updateCourse: (id: string, courseData: any) =>
    apiRequest<any>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),
  deleteCourse: (id: string) =>
    apiRequest<any>(`/courses/${id}`, {
      method: 'DELETE',
    }),

  // Quizzes
  getQuizzes: () => apiRequest<any[]>('/quizzes'),
  getQuizById: (id: string) => apiRequest<any>(`/quizzes/${id}`),
  createQuiz: (quizData: any) =>
    apiRequest<any>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    }),
  updateQuiz: (id: string, quizData: any) =>
    apiRequest<any>(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    }),
  deleteQuiz: (id: string) =>
    apiRequest<any>(`/quizzes/${id}`, {
      method: 'DELETE',
    }),

  // Student Progress
  getStudentProgress: (params?: { studentId?: string; courseId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.studentId) queryParams.append('studentId', params.studentId);
    if (params?.courseId) queryParams.append('courseId', params.courseId);
    const query = queryParams.toString();
    return apiRequest<any[]>(`/student-progress${query ? `?${query}` : ''}`);
  },
  getStudentProgressById: (id: string) => apiRequest<any>(`/student-progress/${id}`),
  createStudentProgress: (progressData: any) =>
    apiRequest<any>('/student-progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    }),
  updateStudentProgress: (id: string, progressData: any) =>
    apiRequest<any>(`/student-progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    }),
  deleteStudentProgress: (id: string) =>
    apiRequest<any>(`/student-progress/${id}`, {
      method: 'DELETE',
    }),

  // Notifications
  getNotifications: (params?: { recipientId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.recipientId) queryParams.append('recipientId', params.recipientId);
    const query = queryParams.toString();
    return apiRequest<any[]>(`/notifications${query ? `?${query}` : ''}`);
  },
  getNotificationById: (id: string) => apiRequest<any>(`/notifications/${id}`),
  createNotification: (notificationData: any) =>
    apiRequest<any>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),
  updateNotification: (id: string, notificationData: any) =>
    apiRequest<any>(`/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(notificationData),
    }),
  deleteNotification: (id: string) =>
    apiRequest<any>(`/notifications/${id}`, {
      method: 'DELETE',
    }),

  // Chat Messages
  getChatMessages: () => apiRequest<any[]>('/chat-messages'),
  getChatMessageById: (id: string) => apiRequest<any>(`/chat-messages/${id}`),
  createChatMessage: (messageData: any) =>
    apiRequest<any>('/chat-messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),
  updateChatMessage: (id: string, messageData: any) =>
    apiRequest<any>(`/chat-messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(messageData),
    }),
  deleteChatMessage: (id: string) =>
    apiRequest<any>(`/chat-messages/${id}`, {
      method: 'DELETE',
    }),

  // Live Sessions
  getLiveSessions: () => apiRequest<any[]>('/live-sessions'),
  getLiveSessionById: (id: string) => apiRequest<any>(`/live-sessions/${id}`),
  createLiveSession: (sessionData: any) =>
    apiRequest<any>('/live-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    }),
  updateLiveSession: (id: string, sessionData: any) =>
    apiRequest<any>(`/live-sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    }),
  deleteLiveSession: (id: string) =>
    apiRequest<any>(`/live-sessions/${id}`, {
      method: 'DELETE',
    }),

  // Assignments
  getAssignments: (params?: { courseId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.courseId) queryParams.append('courseId', params.courseId);
    const query = queryParams.toString();
    return apiRequest<any[]>(`/assignments${query ? `?${query}` : ''}`);
  },
  getAssignmentById: (id: string) => apiRequest<any>(`/assignments/${id}`),
  createAssignment: (assignmentData: any) =>
    apiRequest<any>('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    }),
  updateAssignment: (id: string, assignmentData: any) =>
    apiRequest<any>(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    }),
  deleteAssignment: (id: string) =>
    apiRequest<any>(`/assignments/${id}`, {
      method: 'DELETE',
    }),

  // One-to-One Sessions
  getOneToOneSessions: (params?: { studentId?: string; instructorId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.studentId) queryParams.append('studentId', params.studentId);
    if (params?.instructorId) queryParams.append('instructorId', params.instructorId);
    const query = queryParams.toString();
    return apiRequest<any[]>(`/one-to-one-sessions${query ? `?${query}` : ''}`);
  },
  getOneToOneSessionById: (id: string) => apiRequest<any>(`/one-to-one-sessions/${id}`),
  createOneToOneSession: (sessionData: any) =>
    apiRequest<any>('/one-to-one-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    }),
  updateOneToOneSession: (id: string, sessionData: any) =>
    apiRequest<any>(`/one-to-one-sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    }),
  deleteOneToOneSession: (id: string) =>
    apiRequest<any>(`/one-to-one-sessions/${id}`, {
      method: 'DELETE',
    }),

  // Live Session Progress
  getLiveSessionProgress: (params?: { sessionId?: string; studentId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.sessionId) queryParams.append('sessionId', params.sessionId);
    if (params?.studentId) queryParams.append('studentId', params.studentId);
    const query = queryParams.toString();
    return apiRequest<any[]>(`/live-session-progress${query ? `?${query}` : ''}`);
  },
  getLiveSessionProgressById: (id: string) => apiRequest<any>(`/live-session-progress/${id}`),
  createLiveSessionProgress: (progressData: any) =>
    apiRequest<any>('/live-session-progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    }),
  updateLiveSessionProgress: (id: string, progressData: any) =>
    apiRequest<any>(`/live-session-progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    }),
  deleteLiveSessionProgress: (id: string) =>
    apiRequest<any>(`/live-session-progress/${id}`, {
      method: 'DELETE',
    }),

  // Banners
  getBanners: () => apiRequest<any[]>('/banners'),
  getBannerById: (id: string) => apiRequest<any>(`/banners/${id}`),
  createBanner: (bannerData: any) =>
    apiRequest<any>('/banners', {
      method: 'POST',
      body: JSON.stringify(bannerData),
    }),
  updateBanner: (id: string, bannerData: any) =>
    apiRequest<any>(`/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    }),
  deleteBanner: (id: string) =>
    apiRequest<any>(`/banners/${id}`, {
      method: 'DELETE',
    }),
};

