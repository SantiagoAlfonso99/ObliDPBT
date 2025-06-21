



// import { useState } from 'react';
// import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
// import PostCard, { Post } from '@/components/PostCard';

// const mockLost: Post[] = [
//   { id: '1', author: 'Pepe Rodriguez', createdAt: '13 de mayo · 07:14', description: '¡Buenas! Esta es mi perra Luna...', image: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=400&q=60' },
// ];
// const mockAdopt: Post[] = [
//   { id: '2', author: 'Refugio Patitas', createdAt: '11 de mayo · 10:00', description: 'Cachorra en adopción...', image: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=400&q=60' },
// ];

// type FeedType = 'LOST' | 'ADOPT';

// export default function HomeFeed() {
//   const [feedType, setFeedType] = useState<FeedType>('LOST');
//   const data = feedType === 'LOST' ? mockLost : mockAdopt;

//   return (
//     <View style={styles.container}>
//       {/* Selector */}
//       <View style={styles.selectorContainer}>
//         <TouchableOpacity style={[styles.selectorBtn, feedType === 'LOST' && styles.active]} onPress={() => setFeedType('LOST')}>
//           <Text style={[styles.selectorText, feedType === 'LOST' && styles.activeText]}>Animales / Objetos perdidos</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.selectorBtn, feedType === 'ADOPT' && styles.active]} onPress={() => setFeedType('ADOPT')}>
//           <Text style={[styles.selectorText, feedType === 'ADOPT' && styles.activeText]}>Adopciones</Text>
//         </TouchableOpacity>
//       </View>
//       {/* Lista */}
//       <FlatList data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => <PostCard post={item} />} contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 12 }} />
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f2f2f2' },
//   selectorContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 6, justifyContent: 'space-around' },
//   selectorBtn: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 20 },
//   selectorText: { fontSize: 13, color: '#1E3F8A' },
//   active: { backgroundColor: '#1E3F8A' },
//   activeText: { color: '#fff', fontWeight: '600' },
// });