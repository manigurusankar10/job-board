import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { getAccessToken } from '../auth';

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
  return forward(operation);
})


export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // Globally set fetch policies for all requests
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: 'network-only'
  //   },
  //   watchQuery: {
  //     fetchPolicy: 'network-only'
  //   }
  // }
});

export const jobByIdQuery = gql`
  query JobById ($id: ID!) { 
    job(id: $id) {
      id
      date
      title
      company {
        id
        name
      }
      description
    }
  }
`;

export const jobsQuery = gql`
  query Jobs {
    jobs {
      id,
      date,
      company {
        name,
        id
      }
      title
    }
  }
`;

export const companyByIdQuery = gql`
    query getCompany ($id: ID!) { 
      company(id: $id) {
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `;

export const createJobMutation = gql`
mutation CreateJob ($input: CreateJobInput!) {
  job: createJob(input: $input) {
      id
      date
      title
      company {
        id
        name
      }
      description
    }
  }
`;
