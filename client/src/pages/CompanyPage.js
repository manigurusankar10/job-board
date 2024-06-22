import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { getCompany } from '../lib/graphql/queries';

function CompanyPage() {
  const { companyId } = useParams();
  const [requestState, setRequestState] = useState({
    company: null,
    loading: true,
    error: false
  })

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);
        setRequestState({ company, loading: false, error: false});
      } catch (err) {
        setRequestState({ company: null, loading: false, error: err});
      }
    })();
  }, [companyId]);

  const { company, loading, error } = requestState;

  if (loading) {
    return <div>Loading....</div>
  }
  if (error) {
    return <div className='has-text-danger'>Data Unavailable</div>
  }

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className='title is-5'>
        Jobs at {company.name}
        <JobList jobs={company.jobs} />
      </h2>
    </div>
  );
}

export default CompanyPage;
