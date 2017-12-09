<?php

require_once(dirname(__FILE__) . '/lib.php');

//--------------------------------------------------------------------------------------------------
function api_output($obj, $format='json', $callback='')
{
	$status = 404;
	
	// $obj may be array (e.g., for citeproc)
	if (is_array($obj))
	{
		if (isset($obj['status']))
		{
			$status = $obj['status'];
		}
	}
	
	// $obj may be object
	if (is_object($obj))
	{
		if (isset($obj->status))
		{
			$status = $obj->status;
		}
	}

	switch ($status)
	{
		case 303:
			header('HTTP/1.1 404 See Other');
			break;

		case 404:
			header('HTTP/1.1 404 Not Found');
			break;
			
		case 410:
			header('HTTP/1.1 410 Gone');
			break;
			
		case 500:
			header('HTTP/1.1 500 Internal Server Error');
			break;
			 			
		default:
			break;
	}
	
	//header("Cache-control: max-age=3600");
	
	switch ($format)
	{
		case 'xml':
			header("Content-type: text/xml");
			echo $obj->xml;
			break;
			
		case 'txt':
		case 'text':
			header("Content-type: text/plain; charset=utf-8");
			echo $obj->txt;
			break;		
	
		case 'json':
		default:
			header("Content-type: text/plain");
	
			if ($callback != '')
			{
				echo $callback . '(';
			}
			//echo json_encode($obj, JSON_PRETTY_PRINT);	
			echo json_format(json_encode($obj));
			if ($callback != '')
			{
				echo ')';
			}
			break;
	}
}

?>