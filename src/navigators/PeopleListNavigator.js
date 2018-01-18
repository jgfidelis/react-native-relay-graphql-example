import React, { PureComponent } from 'react';
import { View, Text, Button } from 'react-native';
import { request } from 'graphql-request';

import PeopleList from '../components/PeopleList';

const urlGraphServer = 'https://graphql-sw-api-gxmdjgcfhi.now.sh';

export default class PeopleListNavigator extends PureComponent {

  static navigationOptions = () => ({
    title: 'Star Wars Characters',
    headerStyle: { height: 80, paddingTop: 25, },
  });

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      page: 1,
      isFetching: false
    };
    this.fetchData(1);
  }

  fetchData = (page) => {
    //skip if already fetching or page greater than 9
    //should never happen!
    if (page > 9 || this.state.isFetching) {
      return;
    }
    //do not set state if page is 1
    if (page > 1) {
      this.setState(previousState => ({ ...previousState, isFetching: true }));
    }
    const query = `
    {
      peoplePage(page:${page}) {
        name
        height
        mass
        hairColor
        birthYear
        species
        homeworld
        films
        gender
      }
    }`;

    request(urlGraphServer, query).then(data => {
      this.setState(previousState => ({
        dataSource: [...previousState.dataSource, ...data.peoplePage], 
        page: previousState.page + 1, 
        isFetching: false }
       ));
    }).catch(error => {
      console.log('error');
      console.log(error);
    });
  }

  renderEmptyList = () => <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 24 }}> {'Loading...'}</Text>
                        </View>;

  renderList = () => <PeopleList
                        navigation={this.props.navigation}
                        allPeople={this.state.dataSource}
                        isRefreshing={this.state.isFetching}
  />;

  renderListFetchingData = () => <View style={{ flex: 1 }}>
                                    {this.renderList()}
                                    <Button onPress={() => {}} title='Loading...' />
                                  </View>
  renderListNotFetching = () => <View style={{ flex: 1 }}>
                                  {this.renderList()}
                                  <Button 
                                  onPress={() => this.fetchData(this.state.page)} title='Load More' 
                                  />
                                </View>

  render() {
    if (this.state.dataSource.length === 0) {
      return this.renderEmptyList();
    }
    if (this.state.isFetching) {
      return this.renderListFetchingData();
    }
    return this.renderListNotFetching();
  }
}
