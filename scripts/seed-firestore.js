const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : require('../firebase-service-account.json'); // Fallback to file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function seedData() {
  console.log('Starting Firestore seeding...\n');

  try {
    // Seed Equipment
    console.log('Seeding equipment...');
    const equipment = [
      {
        name: 'Projector - Sony VPL-FHZ90',
        category: 'Projectors',
        description: 'High-quality 4K projector for presentations and events',
        quantity: 3,
        image_url: '/professional-projector.jpg',
        is_available: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Laptop - MacBook Pro 16',
        category: 'Computers',
        description: '16-inch MacBook Pro with M2 chip',
        quantity: 5,
        image_url: '/modern-laptop.png',
        is_available: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Camera - Canon EOS R5',
        category: 'Cameras',
        description: 'Professional mirrorless camera with 4K video',
        quantity: 2,
        image_url: '/professional-camera.png',
        is_available: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Drone - DJI Air 3',
        category: 'Drones',
        description: 'Professional drone for aerial photography',
        quantity: 1,
        image_url: '/drone-quadcopter.jpg',
        is_available: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Studio Lighting Kit',
        category: 'Lighting',
        description: 'Professional studio lighting setup',
        quantity: 4,
        image_url: '/studio-lighting-kit.png',
        is_available: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Microphone - Studio Quality',
        category: 'Audio',
        description: 'Professional studio microphone',
        quantity: 3,
        image_url: '/microphone-studio.jpg',
        is_available: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Ultrawide Monitor',
        category: 'Monitors',
        description: '32-inch ultrawide monitor for presentations',
        quantity: 6,
        image_url: '/ultrawide-monitor-setup.png',
        is_available: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Color Printer',
        category: 'Printers',
        description: 'High-quality color printer',
        quantity: 2,
        image_url: '/color-printer.jpg',
        is_available: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const item of equipment) {
      await db.collection('equipment').add(item);
      console.log(`  ✓ Added: ${item.name}`);
    }

    console.log('\nEquipment seeding complete!\n');

    // Ask about creating admin user
    rl.question('Do you want to create an admin user? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        rl.question('Admin email: ', async (email) => {
          rl.question('Admin password: ', async (password) => {
            rl.question('Admin name: ', async (name) => {
              try {
                // Create user in Firebase Auth
                const userRecord = await admin.auth().createUser({
                  email,
                  password,
                  displayName: name || 'Admin User',
                });

                // Create user document in Firestore
                await db.collection('users').add({
                  name: name || 'Admin User',
                  email,
                  role: 'admin',
                  firebase_uid: userRecord.uid,
                  created_at: admin.firestore.FieldValue.serverTimestamp(),
                  updated_at: admin.firestore.FieldValue.serverTimestamp(),
                });

                console.log(`\n✓ Admin user created: ${email}`);
                console.log('  UID:', userRecord.uid);
              } catch (error) {
                console.error('Error creating admin user:', error.message);
              }
              
              rl.close();
              process.exit(0);
            });
          });
        });
      } else {
        rl.close();
        console.log('\nSeeding complete!');
        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    rl.close();
    process.exit(1);
  }
}

seedData();

