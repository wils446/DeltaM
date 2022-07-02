import { Octokit } from "octokit";
import { ICommitResponse } from "./ICommitsResponse";

export const getCommits = async (branch: string): Promise<ICommitResponse[]> => {
	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN,
	});

	const res = await octokit.request("GET /repos/wils446/deltam/commits", {
		per_page: 5,
		sha: branch,
	});

	return res.data as ICommitResponse[];
};
