export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function scheduleBookReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  // Schedule notifications for 10 AM and 4 PM
  const now = new Date();
  const morning = new Date(now);
  morning.setHours(10, 0, 0, 0);
  
  const afternoon = new Date(now);
  afternoon.setHours(16, 0, 0, 0);

  // If time has passed for today, schedule for tomorrow
  if (now > morning) {
    morning.setDate(morning.getDate() + 1);
  }
  if (now > afternoon) {
    afternoon.setDate(afternoon.getDate() + 1);
  }

  // Schedule morning notification
  const morningDelay = morning.getTime() - now.getTime();
  setTimeout(() => {
    showNotification('Morning Writing Reminder', {
      body: "Start your day with creativity! Generate a new book now.",
      icon: '/AppImages/logo.png',
      badge: '/AppImages/logo.png',
      tag: 'morning-reminder',
      data: {
        url: window.location.origin + '/generator'
      }
    });
    // Reschedule for next day
    scheduleBookReminders();
  }, morningDelay);

  // Schedule afternoon notification
  const afternoonDelay = afternoon.getTime() - now.getTime();
  setTimeout(() => {
    showNotification('Afternoon Writing Reminder', {
      body: "Take a creative break! Time to generate another masterpiece.",
      icon: '/AppImages/logo.png',
      badge: '/AppImages/logo.png',
      tag: 'afternoon-reminder',
      data: {
        url: window.location.origin + '/generator'
      }
    });
  }, afternoonDelay);
}

function showNotification(title: string, options: NotificationOptions) {
  const notification = new Notification(title, options);
  
  notification.onclick = function(event) {
    event.preventDefault();
    window.focus();
    if (options.data?.url) {
      window.location.href = options.data.url;
    }
  };
} 