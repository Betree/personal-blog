---
title: Display channel users count with Elixir/Phoenix + React/Redux
subTitle: Implementing a users count feature using Phoenix Presence.
category: "elixir"
cover: banner.png
---

A few months ago, we decided to implement a users count feature on
[CaptainFact](https://captainfact.io)'s videos pages. It had to be reliable,
light and simple. We also wanted to differenciate between logged-in and anonymous users. 

![Banner](banner.png)

The most intresting read I had at the time to start this was a
[medium article](https://medium.com/@pejrich/tracking-anonymous-unauthorized-users-with-elixir-phoenix-channels-and-presence-cfec1b93c1b0)
which has one major flaw: the **full** users list is returned from the backend and the count
occurs on the frontend (which actually respects the default behaviour of `Phoenix.Presence`).

Depending on your business, it can represent a privacy issue (you don't especially
want anyone to be able to know who's connected to your channel) as well as a performance
issue.

In the follwing article, I'll show you how I implemented `Phoenix.Presence` in such a way that
it only returns the total of connected / anonymous users. We'll then see how it
is binded to `Redux`.

## Backend

### Implementing `Phoenix.Presence`

The first thing you want to build this feature is to implement your own tracker:

```elixir
defmodule MyAppWeb.Presence do
  @moduledoc """
  Provides presence tracking to channels and processes.

  See the [`Phoenix.Presence`](http://hexdocs.pm/phoenix/Phoenix.Presence.html)
  docs for more details.
  """

  # Replace the values below with your app's values
  use Phoenix.Presence, otp_app: :my_app, pubsub_server: MyApp.PubSub
end
```

This implementation is enough if you want to return the classic users list (for 
example in a chat). In our case we want to override the default fetch to return
only the users count, and not the full users list:

```elixir
@doc """
Overrides the default fetch. Instead of returning the full users list,
we only return the count of open sockets.
This map is what will be returned to the frontend.
"""
def fetch(_topic, entries) do
  %{
    "viewers" => %{"count" => count_presences(entries, "viewers")},
    "users" => %{"count" => count_presences(entries, "users")}
  }
end

defp count_presences(entries, key) do
  case get_in(entries, [key, :metas]) do
    nil -> 0
    metas -> length(metas)
  end
end
```

## Binding the presence module

### Add your new module to your app's supervisor

```elixir
defmodule MyApp.Application do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      # Presence to track number of connected users to a channel
      supervisor(CaptainFactWeb.Presence, []),
      ...
    ]
  end
end
```

### Plugging Presence on the channel

Last thing you need to do is to plug your new `Presence` module to your channel.
This part depends of how you've implemented channels authentication, in our case
we detect an authenticated channel by setting a `user_id` in the channel attributes.

Add the two following functions to the channel you want to track:

```elixir
@doc """
Register a public connection in presence tracker
"""
def handle_info(:after_join, socket = %{assigns: %{user_id: nil}}) do
  {:ok, _} = Presence.track(socket, :viewers, %{})
  push_presence_state(socket)
  {:noreply, socket}
end

@doc """
Register a user connection in presence tracker
"""
def handle_info(:after_join, socket = %{assigns: %{user_id: user_id}}) do
  {:ok, _} = Presence.track(socket, :users, %{user_id: user_id})
  push_presence_state(socket)
  {:noreply, socket}
end

defp push_presence_state(socket) do
  push(socket, "presence_state", Presence.list(socket))
end
```  