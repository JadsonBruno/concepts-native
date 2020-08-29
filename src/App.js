import React from "react";
import {useEffect} from 'react';
import {useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import api from './services/api';
import {styles} from './styles';

export default function App() {
  const [repositories, setRepositories] = useState([]);
  
  /**
   * I get all repositories from api.
   */
  async function getRepositories ()
  {
    const response = await api.get('/repositories');
    setRepositories(response.data);
  }

  // get all repositories when the component is mounted
  useEffect(() => {
    getRepositories();
  }, []);


  /**
   * I handle the like repository action.
   */
  async function handleLikeRepository(id) {
    // like repository
    const response = await api.post(`/repositories/${id}/like`);

    // get updated amount of likes
    const likes = response.data.likes;

    // update amount of likes in the local repository
    const updatedRepositories = repositories.map(repository => {
      return repository.id === id ? {... repository, likes} : repository;
    });

    // update local state
    setRepositories(updatedRepositories);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({item: repository}) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {repository.techs.map((tech, index) =>
                  <Text style={styles.tech} key={index}>
                    {tech}
                  </Text>
                )}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}   
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}
