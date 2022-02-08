const flushPromises = () => new Promise(setImmediate);

const getErrorMessages = (nums = 1) => {
  const errors = [];
  for (let i = 0; i < nums; i++) {
    errors.push(`error-${i}`);
  }

  return errors;
};

const getMessages = (nums = 1, firstPersonName = "test") => {
  const messages = [];
  for (let i = 0; i < nums; i++) {
    let user = firstPersonName;
    if (i % 2 == 0) {
      user = "other";
    }

    const messageObj = {
      text: `test-${i}`,
      user,
    };

    // Add time stamp to some messsage
    if (i % 3 == 0) {
      messageObj.timeStamp = {
        toDate: () => new Date(),
      };
    }

    messages.push(messageObj);
  }

  return messages;
};

const mockScrollProp = (isSetToBottom) => ({
  clientHeight: {
    get: function () {
      return 500;
    },
    configurable: true,
  },
  scrollTop: {
    get: function () {
      return isSetToBottom ? 200 : 100;
    },
    configurable: true,
  },
  scrollHeight: {
    get: function () {
      return 700;
    },
    configurable: true,
  },
});

const getUsers = (nums = 1) => {
  const userList = [];

  for (let i = 0; i < nums; i++) {
    userList.push({ name: `testUser-${i}` });
  }

  return userList;
};

const getAuthFormValue = (isSignIn = false) =>
  isSignIn
    ? {
        target: {
          email: {
            value: "test-email",
          },
          password: {
            value: "test-password",
          },
        },
      }
    : {
        target: {
          username: {
            value: "test-username",
          },
          email: {
            value: "test-email",
          },
          password: {
            value: "test-password",
          },
        },
      };

const generateDummyRooms = (numOfItems) => {
  const rooms = [];
  for (let i = 0; i < numOfItems; i++) {
    rooms.push({
      date_created: { seconds: new Date().getTime() + i },
      roomName: `test-room-${i}`,
      users: new Array(i),
    });
  }

  return rooms;
};

export {
  flushPromises,
  getErrorMessages,
  getMessages,
  mockScrollProp,
  getUsers,
  getAuthFormValue,
  generateDummyRooms,
};
