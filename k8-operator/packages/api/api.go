package api

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

const USER_AGENT_NAME = "k8-operator"

func CallGetEncryptedWorkspaceKey(httpClient *resty.Client, request GetEncryptedWorkspaceKeyRequest) (GetEncryptedWorkspaceKeyResponse, error) {
	endpoint := fmt.Sprintf("%v/v2/workspace/%v/encrypted-key", API_HOST_URL, request.WorkspaceId)
	var result GetEncryptedWorkspaceKeyResponse
	response, err := httpClient.
		R().
		SetResult(&result).
		SetHeader("User-Agent", USER_AGENT_NAME).
		Get(endpoint)

	if err != nil {
		return GetEncryptedWorkspaceKeyResponse{}, fmt.Errorf("CallGetEncryptedWorkspaceKey: Unable to complete api request [err=%s]", err)
	}

	if response.StatusCode() > 299 {
		return GetEncryptedWorkspaceKeyResponse{}, fmt.Errorf("CallGetEncryptedWorkspaceKey: Unsuccessful response: [response=%s]", response)
	}

	return result, nil
}

func CallGetServiceTokenDetailsV2(httpClient *resty.Client) (GetServiceTokenDetailsResponse, error) {
	var tokenDetailsResponse GetServiceTokenDetailsResponse
	response, err := httpClient.
		R().
		SetResult(&tokenDetailsResponse).
		SetHeader("User-Agent", USER_AGENT_NAME).
		Get(fmt.Sprintf("%v/v2/service-token", API_HOST_URL))

	if err != nil {
		return GetServiceTokenDetailsResponse{}, fmt.Errorf("CallGetServiceTokenDetails: Unable to complete api request [err=%s]", err)
	}

	if response.IsError() {
		return GetServiceTokenDetailsResponse{}, fmt.Errorf("CallGetServiceTokenDetails: Unsuccessful response: [response=%s]", response)
	}

	return tokenDetailsResponse, nil
}

func CallGetSecretsV2(httpClient *resty.Client, request GetEncryptedSecretsV2Request) (GetEncryptedSecretsV2Response, error) {
	var secretsResponse GetEncryptedSecretsV2Response = GetEncryptedSecretsV2Response{}
	createHttpRequest := httpClient.
		R().
		SetResult(&secretsResponse.Secrets).
		SetQueryParam("environment", request.EnvironmentName).
		SetHeader("User-Agent", USER_AGENT_NAME)

	if request.ETag != "" {
		createHttpRequest.SetHeader("If-None-Match", request.ETag)
	}

	response, err := createHttpRequest.Get(fmt.Sprintf("%v/v2/secret/workspace/%v", API_HOST_URL, request.WorkspaceId))
	if err != nil {
		return GetEncryptedSecretsV2Response{}, fmt.Errorf("CallGetSecretsV2: Unable to complete api request [err=%s]", err)
	}

	if response.IsError() {
		return GetEncryptedSecretsV2Response{}, fmt.Errorf("CallGetSecretsV2: Unsuccessful response: [response=%s]", response)
	}

	if response.StatusCode() == 304 {
		secretsResponse.Modified = false
	} else {
		secretsResponse.Modified = true
	}

	secretsResponse.ETag = response.Header().Get("etag")

	return secretsResponse, nil
}
