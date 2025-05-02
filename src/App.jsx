import Dexie from 'dexie';
import { useEffect, useState } from 'react';


function App() {
  
  const db = new Dexie('MyDatabase');
  db.version(1).stores({
    friends: '++id, name, age',
    notes: '++id, title, content'
  });


  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function run() {
      try {
        const id = await db.friends.add({ name: 'Charlie', age: 28 });
        console.log(`Added friend with id ${id}`);

        const friend = await db.friends.get(id);
        console.log('Found friend:', friend);

        await db.friends.update(id, { age: 30 });
        console.log('Friend updated');

        const friends = await db.friends.where('age').above(25).toArray();
        console.log('Friends older than 25:', friends);
        setFriends(friends); // Update state with the fetched data

        // await db.friends.delete(id);
        console.log('Friend deleted');
      } catch (err) {
        console.error('Error:', err);
      }
    }

    run();
  }, []);

  return (
    <div>
      <h1>Friends List</h1>
      <ul>
        {friends.map(friend => (
          <li key={friend.id}>
            Name: {friend.name}, Age: {friend.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;