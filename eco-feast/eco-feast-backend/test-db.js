const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/eco-feast', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test creating a document
    const testSchema = new mongoose.Schema({ name: String });
    const Test = mongoose.model('Test', testSchema);
    
    const testDoc = new Test({ name: 'test' });
    await testDoc.save();
    console.log('Successfully created test document');
    
    // Test reading the document
    const docs = await Test.find();
    console.log('Found documents:', docs);
    
    // Clean up
    await Test.deleteMany({});
    console.log('Test completed successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

testConnection(); 