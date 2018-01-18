import React, { PureComponent } from 'react';
import { View, ScrollView, RefreshControl, } from 'react-native';

import PeopleListItem from './PeopleListItem';

export default class PeopleList extends PureComponent {

    renderPeople = (allPeople) => {
    let people = [];
    allPeople.forEach(person => {
        if (person.mass > 0 && person.height > 0) {
          people.push(person); 
        }
    });
    
    people = people.sort((A, B) => {
      const bmiA = A.mass / (A.height * A.height);
      const bmiB = B.mass / (B.height * B.height);
      return bmiB - bmiA;
    });

    const peopleList = people.map(person => <PeopleListItem
                                              key={person.name}
                                              person={person}
                                              navigation={this.props.navigation}
    />
    );

    return peopleList;
  }

  render() {
    const { allPeople, isRefreshing } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} />}>
          {this.renderPeople(allPeople)}
        </ScrollView>
      </View>
    );
  }
}
