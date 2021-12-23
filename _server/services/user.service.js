import {
  getAuth,
} from 'firebase-admin/auth';

async function updateUserPhoneNumberService(request) {
  console.log(request.body);

  const { jwt, verify_id_token, phoneNumber } = request.body;
  if (!(jwt && verify_id_token)) return { error: "ส่ง jwt, verify_id_token มาก่อน" };

  let userVerify;
  // https://firebase.google.com/docs/auth/admin/verify-id-tokens
  try {
    userVerify = await getAuth()
      .verifyIdToken(jwt);
    console.log(userVerify);
  } catch (error) {
    console.error(error);
    return { code: 401, error };
  }

  userFirebase = await getAuth()
    .updateUser(userVerify.user_id, {
      phoneNumber
    })
    .catch((error) => {
      console.error(error);
      return error;
    });

  return {
    userFirebase,
    verifyIdToken,
  };
}

export default {
  updateUserPhoneNumberService,
};
