import axios from "axios";

export const post = async ({ route, params }, cxt) => {
  const url = `http://localhost:${cxt.port}` + route;
  try {
    const { data } = await axios.post(
      url,
      params
    );

    console.log(JSON.stringify(data));
    return data;
  } catch (e) {
    cxt.logger.error("agent.request", { error: e.toString() });
  }
};
