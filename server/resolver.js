import { countJobs, createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from './db/jobs.js';
import { getCompany } from './db/companies.js';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs();
      return { items, totalCount}
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError('No job found with id' + id);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError('No company found with id' + id);
      }
      return company;
    }
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id)
  },
  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt)
  },
  Mutation: {
    createJob: (_root, { input: { title, description }}, { user }) => {
      if (!user) {
        return unauthorizedError('Missing authentication');
      }
      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        return unauthorizedError('Missing authentication');
      }
      const job = deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError('No job found with id' + id);
      }
      return job;
    },
    updateJob: async (_root, { input: { id, title, description }}, { user }) => {
      if (!user) {
        return unauthorizedError('Missing authentication');
      }
      const job = updateJob({id, title, description, companyId: user.companyId})
      if (!job) {
        throw notFoundError('No job found with id' + id);
      }
      return job;
    }
  }
};

function notFoundError (message) {
  return new GraphQLError(message, {
    extensions : {
      code: 'NOT_FOUND'
    }
  });
}

function unauthorizedError (message) {
  return new GraphQLError(message, {
    extensions : {
      code: 'UNAUTHORIZED'
    }
  });
}


function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length)
}