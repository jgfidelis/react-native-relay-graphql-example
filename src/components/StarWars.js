import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

import Relay, {
  graphql,
  QueryRenderer,
  createRefetchContainer
} from 'react-relay';

import environment from '../environment';


class StarWars extends Component {
  state = {
    isFetching: false,
    isFetchingEnd: false,
    page: 1,
    dataSource: []
  };
  renderItem = ({ item }) => {
    const { name, gender } = item;
    return (
      <View>
        <Text>{name}</Text>
        <Text>{gender}</Text>
      </View>
    );
  }

  onRefresh = () => {
    const { isFetching } = this.state;

    if (isFetching) return;

    this.setState({ isFetching: true });

    const refetchVariables = fragmentVariables => ({
      ...fragmentVariables,
    });

    this.props.relay.refetch(
      refetchVariables,
      null,
      () => {
        this.setState({
          isFetching: false,
          isFetchingEnd: false,
        });
      },
      {
        force: true,
      },
    );
  };

  onEndReached = () => {
    const { isFetchingEnd, page } = this.state;

    if (isFetchingEnd === true) return;

    if (page > 9) return;

    this.setState({
      isFetchingEnd: true,
      page: page + 1,
    });

    
    const refetchVariables = fragmentVariables => ({
      ...fragmentVariables,
      page: page + 1
    });

    this.props.relay.refetch(
      refetchVariables,
      null,
      () => {
        this.setState({
          isFetchingEnd: false,
          isFetching: false,
        });
      },
      {
        force: false,
      },
    );
  };

  renderFooter = () => {
    if (this.state.isFetchingEnd) {
      return null;
    }
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator />
      </View>
    );
  }

  
  render() {
    const { peoplePage } = this.props.query;
    console.log(peoplePage);
    return (
      <FlatList
        data={peoplePage}
        renderItem={this.renderItem}
        keyExtractor={item => item.name}
        onRefresh={this.onRefresh}
        refreshing={this.state.isFetching}
        ListFooterComponent={this.renderFooter}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={1} //on list 
      />
    );
  }
}

const StarWarsRefetchContainer = createRefetchContainer(
  StarWars,
  {
    query: graphql`
      fragment StarWars_query on Query
      @argumentDefinitions(
          page: { type: "Int", defaultValue: 1 }
        ) {
        peoplePage(page: $page) {
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
      }
    `,
  },
  graphql`
    query StarWarsRefetchQuery( $page: Int ) {
      ...StarWars_query @arguments(page: $page)
    }
  `,
);

const StarWarsQueryRenderer = () => (
  <QueryRenderer
    environment={environment}
    query={graphql`
        query StarWarsQuery {
          ...StarWars_query
        }
      `
    }
    render={({ error, props }) => {
      if (error) {
        return (
          <View>
            <Text>An unexpected error occurred</Text>
          </View>
        );
      } else if (props) {
        return <StarWarsRefetchContainer query={props} />;
      }
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator animating={true} size="large" color="rgb(0, 148, 255)" />
        </View>
      );
    }}
  />
);

export default StarWarsQueryRenderer;
