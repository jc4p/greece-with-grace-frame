import * as frame from '@farcaster/frame-sdk'

export async function initializeFrame() {
  try {
    const context = await frame.sdk.context

    if (!context || !context.user) {
      console.log('Not in a Farcaster Frame or user not authenticated');
      return;
    }

    let user = context.user
    
    // Handle the case where user might be nested inside another 'user' object
    let userInfo = user;
    if (user && user.user) {
      userInfo = user.user;
    }

    if (!userInfo || !userInfo.fid) {
      // most likely not in a frame
      console.log('Not in a Farcaster Frame or user not authenticated');
      return;
    }

    console.log('Frame initialized with FID:', userInfo.fid);
    window.userFid = userInfo.fid;
    
    // Call the ready function to remove splash screen when in a frame
    await frame.sdk.actions.ready();
  } catch (error) {
    console.error('Error initializing Frame:', error);
  }
} 